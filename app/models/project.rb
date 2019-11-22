class Project < ApplicationRecord

  # Concerns

  include CustomFieldsConcern
  include CommonIndexConcern
  include ProjectIndexConcern
  include CableActionsConcern

  # Uploaders

  mount_uploader :picture, PictureUploader
  include GravatarConcern # Must stay here because override previous line!

  # Associations

  belongs_to :lab

  has_many :item_tag_links, :dependent => :destroy, :as => :item
  has_many :tags, :through => :item_tag_links

  has_many :contact_project_links # dependent destroy is made in around_destroy_callback
  has_many :contacts, :through => :contact_project_links

  has_many :organization_project_links # dependent destroy is made in around_destroy_callback
  has_many :organizations, :through => :organization_project_links

  has_many :event_project_links # dependent destroy is made in around_destroy_callback
  has_many :events, :through => :event_project_links

  has_many :notes, :as => :notable

  has_many :documents, :as => :uploadable

  has_many :custom_field_links, :dependent => :destroy, :as => :item
  has_many :custom_fields, :through => :custom_field_links

  has_many :log_entries, :as => :item # no dependent destroy/nullify because we want to keep them after deletion

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  }
  validates :name, :uniqueness => { :message => "Le nom indiqué existe déjà." }

  # Callbacks

  after_commit   :after_create_callback,  on: :create
  before_update  :before_update_callback
  after_commit   :after_update_callback,  on: :update
  around_destroy :around_destroy_callback

  def after_create_callback
    # websockets
    cable_create
    contacts.each(&:cable_update)
    organizations.each(&:cable_update)
    events.each(&:cable_update)

    # elasticsearch
    ReindexProjectWorker.perform_async(id)

    # mailchimp
    contacts.each(&:mailchimp_upsert)
  end

  def before_update_callback
    @saved_contact_ids      = contacts.pluck(:id)
    @saved_organization_ids = organizations.pluck(:id)
    @saved_event_ids        = events.pluck(:id)
  end

  def after_update_callback
    # websockets
    cable_update
    Contact.where(     :id => @saved_contact_ids).each(&:cable_update)
    Organization.where(:id => @saved_organization_ids).each(&:cable_update)
    Event.where(       :id => @saved_event_ids).each(&:cable_update)

    # elasticsearch
    ReindexProjectWorker.perform_async(id)

    # mailchimp
    Contact.where(:id => @saved_contact_ids).each(&:mailchimp_upsert)
  end

  def around_destroy_callback
    saved_id               = id
    saved_contact_ids      = contacts.pluck(:id)
    saved_organization_ids = organizations.pluck(:id)
    saved_event_ids        = events.pluck(:id)

    # dependent destroy
    contact_project_links.destroy_all

    yield

    # websockets
    cable_destroy
    Contact.where(:id => saved_contact_ids).each(&:cable_update)
    Organization.where(:id => saved_organization_ids).each(&:cable_update)
    Event.where(:id => saved_event_ids).each(&:cable_update)

    # elasticsearch
    ReindexProjectWorker.perform_async(saved_id, 'delete', saved_contact_ids)

    # mailchimp
    Contact.where(:id => saved_contact_ids).each(&:mailchimp_upsert)
  end

  # Methods

  def sort_name
    if start_date.present?
      10_000_000_000 - start_date.to_time.to_i # because always sorted ASC and we want sooner first
    elsif end_date.present?
      10_000_000_000 - end_date.to_time.to_i # because always sorted ASC and we want sooner first
    else
      10_000_000_000
    end
  end

  def path
    Rails.application.routes.url_helpers.lab_project_path(lab, self)
  end

  def scoped_path
    "#{self.class.name.parameterize.pluralize}/#{id}"
  end

  def association_ids
    {
      :contact_ids      => contact_ids,
      :organization_ids => organization_ids,
      :event_ids        => event_ids,
      :tag_ids          => tag_ids
    }
  end
end
