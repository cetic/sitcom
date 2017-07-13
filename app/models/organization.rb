class Organization < ApplicationRecord

  # Concerns

  include CustomFieldsConcern
  include CommonIndexConcern
  include OrganizationIndexConcern
  include CableActionsConcern

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :item_tag_links, :dependent => :destroy, :as => :item
  has_many :tags, :through => :item_tag_links

  has_many :contact_organization_links # dependent destroy is made in around_destroy_callback
  has_many :contacts, :through => :contact_organization_links

  has_many :organization_project_links # dependent destroy is made in around_destroy_callback
  has_many :projects, :through => :organization_project_links

  has_many :event_organization_links # dependent destroy is made in around_destroy_callback
  has_many :events, :through => :event_organization_links

  has_many :notes, :as => :notable

  has_many :custom_field_links, :dependent => :destroy, :as => :item
  has_many :custom_fields, :through => :custom_field_links

  has_many :log_entries, :as => :item # no dependent destroy/nullify because we want to keep them after deletion

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  },
                   :uniqueness => { :message => "Le nom indiqué existe déjà." }

  validates :website_url, :format      => { :with => URI::regexp(%w(http https)), :message => "L'adresse du site Web est invalide." },
                          :allow_blank => true

  # Callbacks

  after_commit   :after_create_callback,  on: :create
  before_update  :before_update_callback
  after_commit   :after_update_callback,  on: :update
  around_destroy :around_destroy_callback

  def after_create_callback
    # websockets
    cable_create
    contacts.each(&:cable_update)
    events.each(&:cable_update)
    projects.each(&:cable_update)

    # elasticsearch
    ReindexOrganizationWorker.perform_async(id)
  end

  def before_update_callback
    @saved_contact_ids = contacts.pluck(:id)
    @saved_event_ids   = events.pluck(:id)
    @saved_project_ids = projects.pluck(:id)
  end

  def after_update_callback
    # websockets
    cable_update
    Contact.where(:id => @saved_contact_ids).each(&:cable_update)
    Event.where(  :id => @saved_event_ids).each(&:cable_update)
    Project.where(:id => @saved_project_ids).each(&:cable_update)

    # elasticsearch
    ReindexOrganizationWorker.perform_async(id)
  end

  def around_destroy_callback
    saved_id          = id
    saved_contact_ids = contacts.pluck(:id)
    saved_event_ids   = events.pluck(:id)
    saved_project_ids = projects.pluck(:id)

    # dependent destroy
    contact_organization_links.destroy_all

    yield

    # websockets
    cable_destroy
    Contact.where(:id => saved_contact_ids).each(&:cable_update)
    Event.where(:id => saved_event_ids).each(&:cable_update)
    Project.where(:id => saved_project_ids).each(&:cable_update)

    # elasticsearch
    ReindexOrganizationWorker.perform_async(saved_id, 'delete', saved_contact_ids)
  end

  # Methods

  def path
    Rails.application.routes.url_helpers.lab_organization_path(lab, self)
  end

  def scoped_path
    "#{self.class.name.parameterize.pluralize}/#{id}"
  end

  def picture_url(size = nil)
    if picture.present?
      size ? picture.url(size) : picture.url
    else
      txt = "#{name.first}"
      "https://placeholdit.imgix.net/~text?txtsize=68&txt=#{txt}&w=200&h=200"
    end
  end

  def association_ids
    {
      :contact_ids => contact_ids,
      :project_ids => project_ids,
      :event_ids   => event_ids
    }
  end
end
