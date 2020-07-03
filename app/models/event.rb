class Event < ApplicationRecord

  # Concerns

  include CommonItemTypeMethodsConcern
  include CustomFieldsConcern
  include CommonIndexConcern
  include EventIndexConcern
  include CableActionsConcern

  # Associations

  belongs_to :lab

  has_many :item_tag_links, :dependent => :destroy, :as => :item
  has_many :tags, :through => :item_tag_links

  has_many :contact_event_links # dependent destroy is made in around_destroy_callback
  has_many :contacts, :through => :contact_event_links

  has_many :event_organization_links # dependent destroy is made in around_destroy_callback
  has_many :organizations, :through => :event_organization_links

  has_many :event_project_links # dependent destroy is made in around_destroy_callback
  has_many :projects, :through => :event_project_links

  has_many :item_user_links, :dependent => :destroy, :as => :item

  has_many :notes, :as => :notable

  has_many :documents, :as => :uploadable

  has_many :custom_field_links, :dependent => :destroy, :as => :item
  has_many :custom_fields, :through => :custom_field_links

  has_many :log_entries, :as => :item # no dependent destroy/nullify because we want to keep them after deletion

  has_many :tasks, :as => :item, :dependent => :destroy

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire." },
                   :uniqueness => {
                      :scope          => :lab_id,
                      :message        => "Le nom indiqué existe déjà.",
                      :case_sensitive => false
                    }

  validates :website_url, :format      => { :with => URI::regexp(%w(http https)), :message => "L'adresse du site Web est invalide." },
                          :allow_blank => true

  # Callbacks

  before_validation :before_validation_callback
  after_commit      :after_create_callback,  on: :create
  before_update     :before_update_callback
  after_commit      :after_update_callback,  on: :update
  around_destroy    :around_destroy_callback

  def before_validation_callback
    self.website_url = sanitize_url(self.website_url)
  end

  def after_create_callback
    # websockets
    cable_create
    contacts.each(&:cable_update)
    organizations.each(&:cable_update)
    projects.each(&:cable_update)

    # elasticsearch
    ReindexEventWorker.perform_async(id)

    # mailchimp
    contacts.each(&:mailchimp_upsert)
  end

  def before_update_callback
    @saved_contact_ids      = contacts.pluck(:id)
    @saved_organization_ids = organizations.pluck(:id)
    @saved_project_ids      = projects.pluck(:id)
  end

  def after_update_callback
    # websockets
    cable_update
    Contact.where(     :id => @saved_contact_ids     ).each(&:cable_update)
    Organization.where(:id => @saved_organization_ids).each(&:cable_update)
    Project.where(     :id => @saved_project_ids     ).each(&:cable_update)

    # elasticsearch
    ReindexEventWorker.perform_async(id)

    # mailchimp
    Contact.where(:id => @saved_contact_ids).each(&:mailchimp_upsert)
  end

  def around_destroy_callback
    saved_id               = id
    saved_contact_ids      = contacts.pluck(:id)
    saved_organization_ids = organizations.pluck(:id)
    saved_project_ids      = projects.pluck(:id)

    # dependent destroy
    contact_event_links.destroy_all
    event_organization_links.destroy_all
    event_project_links.destroy_all

    yield

    # websockets
    cable_destroy
    Contact.where(     :id => saved_contact_ids     ).each(&:cable_update)
    Organization.where(:id => saved_organization_ids).each(&:cable_update)
    Project.where(     :id => saved_project_ids     ).each(&:cable_update)

    # elasticsearch
    ReindexEventWorker.perform_async(saved_id, 'delete', saved_contact_ids, saved_organization_ids, saved_project_ids)

    # mailchimp
    Contact.where(:id => saved_contact_ids).each(&:mailchimp_upsert)
  end

  # Uploaders
  # => after_commit are called from the last to the first, we need carrierwave before our callbacks
  #    to avoid sending non-updated pictures to frontend.
  # References: * https://github.com/rails/rails/issues/20911
  #             * https://github.com/rails/rails/pull/23462
  #             * https://github.com/carrierwaveuploader/carrierwave/blob/d41ad71ad71a813dddf47e750e5a8b5f5c8d4e0d/README.md#skipping-activerecord-callbacks

  mount_uploader :picture, PictureUploader
  include GravatarConcern # Override previous line!

  # Methods

  def sort_name
    if happens_on.present?
      10_000_000_000 - happens_on.to_time.to_i # because always sorted ASC and we want sooner first
    else
      10_000_000_000
    end
  end

  def path
    Rails.application.routes.url_helpers.lab_event_path(lab, self)
  end

  def url
    Rails.application.routes.url_helpers.lab_event_url(lab, self)
  end

  def scoped_path
    "#{self.class.name.parameterize.pluralize}/#{id}"
  end

  def association_ids
    {
      :contact_ids      => contact_ids,
      :organization_ids => organization_ids,
      :project_ids      => project_ids,
      :tag_ids          => tag_ids
    }
  end
end
