class User < ApplicationRecord
  include GravatarConcern

  # Constants

  # Devise

  devise :database_authenticatable, :recoverable, :rememberable, :trackable

  # Associations

  has_many :lab_user_links, :dependent => :destroy
  has_many :labs, :through => :lab_user_links

  # Validations

  validates :name, :presence => { :message => "Le nom est obligatoire." }

  # Validations (from Devise)

  validates_presence_of   :email, if: :email_required?,                                              message: "L'email est obligatoire."
  validates_uniqueness_of :email, allow_blank: true,         if: :email_changed?,                    message: "L'email est déjà utilisé."
  validates_format_of     :email, with: Devise.email_regexp, allow_blank: true, if: :email_changed?, message: "L'email est invalide."

  validates_presence_of     :password, if: :password_required?,                           message: "Le mot de passe est obligatoire."
  validates_length_of       :password, within: Devise.password_length, allow_blank: true, message: "Le mot de passe est trop court."
  validates_confirmation_of :password,                                                    message: "Le mot de passe et sa confirmation ne concordent pas."

  # Callbacks

  # Methods

  def permissions_for_lab(lab)
    lab_user_link = lab_user_links.where(lab_id: lab.id).first
    lab_user_link.try(:permissions)
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
