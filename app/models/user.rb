class User < ApplicationRecord
  include GravatarConcern

  # Constants

  # Devise

  devise :database_authenticatable, :recoverable, :rememberable, :trackable

  # Associations

  has_many :lab_user_links, :dependent => :destroy
  has_many :labs,           :through   => :lab_user_links
  has_many :notes,          :dependent => :nullify

  has_many :saved_searches, :dependent => :destroy

  has_many :log_entries,    :dependent => :nullify

  has_many :item_user_links, :dependent => :destroy

  has_many :documents, :dependent => :nullify
  has_many :tasks,     :dependent => :nullify

  # has_many :tasked_contacts,      :class_name => "Contact",      :through => :tasks, :source => :item, :source_type => "Contact"
  # has_many :tasked_organizations, :class_name => "Organization", :through => :tasks, :source => :item, :source_type => "Organization"
  # has_many :tasked_projects,      :class_name => "Project",      :through => :tasks, :source => :item, :source_type => "Project"
  # has_many :tasked_events,        :class_name => "Event",        :through => :tasks, :source => :item, :source_type => "Event"

  # Validations

  validates :name, :presence => { :message => "Le nom est obligatoire." }

  # Validations (from Devise)

  validates_presence_of   :email, if: :email_required?,                                              message: "L'email est obligatoire."
  validates_uniqueness_of :email, allow_blank: true,         if: :email_changed?,                    message: "L'email est déjà utilisé.", :case_sensitive => false
  validates_format_of     :email, with: Devise.email_regexp, allow_blank: true, if: :email_changed?, message: "L'email est invalide."

  validates_presence_of     :password, if: :password_required?,                           message: "Le mot de passe est obligatoire."
  validates_length_of       :password, within: Devise.password_length, allow_blank: true, message: "Le mot de passe est trop court."
  validates_confirmation_of :password,                                                    message: "Le mot de passe et sa confirmation ne concordent pas."

  validates_presence_of :lab_ids, message: "Veuillez donner accès à au moins un lab."

  # Callbacks

  before_create     :set_new_api_key
  before_validation :ensure_roles

  after_commit   :after_commit_callback, on: [:create, :update]
  around_destroy :around_destroy_callback

  def after_commit_callback
    tasks.each do |task|
      "Reindex#{task.item_type}Worker".constantize.perform_async(task.item_id)
      task.item.cable_update
    end
  end

  def around_destroy_callback
    saved_task_ids = task_ids

    yield

    Task.where(:id => saved_task_ids).each do |task|
      "Reindex#{task.item_type}Worker".constantize.perform_async(task.item_id)
      task.item.cable_update
    end
  end

  # Methods

  def permissions_for_lab(lab)
    lab_user_link = lab_user_links.where(lab_id: lab.id).first
    lab_user_link.try(:permissions)
  end

  def set_new_api_key
    self.api_key = "#{SecureRandom.hex}#{UUIDTools::UUID.random_create}#{self.id}".gsub('-', '')
  end

  def ensure_roles
    self.lab_manager = false if self.admin
  end

  def managed_labs_count(manager)
    if manager.admin?
      lab_user_links.count
    else
      lab_user_links.where(lab_id: manager.lab_ids).count
    end
  end

  def lab_manager_of?(lab)
    lab_user_links.where(lab_id: lab.id).any? && lab_manager?
  end

  def follow?(item)
    item_user_links.where(
      :item_id   => item.id,
      :item_type => item.class.name
    ).any?
  end

  # Class Methods

  # Private Methods

  private

  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end

  def email_required?
    true
  end
end
