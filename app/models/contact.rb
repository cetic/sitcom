class Contact < ApplicationRecord

  # Concerns

  include CommonItemTypeMethodsConcern
  include CustomFieldsConcern
  include CommonIndexConcern
  include ContactIndexConcern
  include CableActionsConcern

  # Associations

  belongs_to :lab

  has_many :item_tag_links, :dependent => :destroy, :as => :item
  has_many :tags, :through => :item_tag_links

  has_many :contact_field_links, :dependent => :destroy
  has_many :fields, :through => :contact_field_links

  has_many :contact_organization_links # dependent destroy is made in around_destroy_callback
  has_many :organizations, :through => :contact_organization_links

  has_many :contact_event_links # dependent destroy is made in around_destroy_callback
  has_many :events, :through => :contact_event_links

  has_many :contact_project_links # dependent destroy is made in around_destroy_callback
  has_many :projects, :through => :contact_project_links

  has_many :item_user_links, :dependent => :destroy, :as => :item

  has_many :notes, :as => :notable

  has_many :documents, :as => :uploadable

  has_many :custom_field_links, :dependent => :destroy, :as  => :item
  has_many :custom_fields, :through => :custom_field_links

  has_many :log_entries, :as => :item # no dependent destroy/nullify because we want to keep them after deletion

  has_many :tasks, :as => :item, :dependent => :destroy

  # Validations

  validates :first_name, :presence => { :message => "Le prénom est obligatoire."         }
  validates :last_name,  :presence => { :message => "Le nom de famille est obligatoire." }

  validates :email, :format      => { :with => Devise.email_regexp, :message => "L'adresse email est invalide" },
                    :allow_blank => true

  # Callbacks

  before_validation :before_validation_callback
  after_commit      :after_create_callback,  on: :create
  before_update     :before_update_callback
  after_commit      :after_update_callback,  on: :update
  around_destroy    :around_destroy_callback

  def before_validation_callback
    self.twitter_url  = sanitize_url(self.twitter_url,  :twitter)
    self.linkedin_url = sanitize_url(self.linkedin_url, :linkedin)
    self.facebook_url = sanitize_url(self.facebook_url, :facebook)
  end

  def after_create_callback
    # websockets
    cable_create
    organizations.each(&:cable_update)
    projects.each(&:cable_update)
    events.each(&:cable_update)

    # elasticsearch
    ReindexContactWorker.perform_async(id)

    # mailchimp
    mailchimp_upsert
  end

  def before_update_callback
    @saved_organization_ids = organizations.pluck(:id)
    @saved_project_ids      = projects.pluck(:id)
    @saved_event_ids        = events.pluck(:id)
  end

  def after_update_callback
    # websockets
    cable_update
    Organization.where(:id => @saved_organization_ids).each(&:cable_update)
    Project.where(     :id => @saved_project_ids     ).each(&:cable_update)
    Event.where(       :id => @saved_event_ids       ).each(&:cable_update)

    # elasticsearch
    ReindexContactWorker.perform_async(id)

    # mailchimp
    mailchimp_upsert
  end

  def around_destroy_callback
    saved_id               = id
    saved_lab_id           = lab_id
    saved_email            = email
    saved_organization_ids = organizations.pluck(:id)
    saved_project_ids      = projects.pluck(:id)
    saved_event_ids        = events.pluck(:id)

    # dependent destroy
    contact_organization_links.destroy_all
    contact_project_links.destroy_all
    contact_event_links.destroy_all

    yield

    # websockets
    cable_destroy
    Organization.where(:id => saved_organization_ids).each(&:cable_update)
    Project.where(     :id => saved_project_ids     ).each(&:cable_update)
    Event.where(       :id => saved_event_ids       ).each(&:cable_update)

    # elasticsearch
    ReindexContactWorker.perform_async(saved_id, 'delete', saved_organization_ids, saved_project_ids, saved_event_ids)

    # mailchimp
    if Lab.find(saved_lab_id).mailchimp_configured?
      Mailchimp::DeleteContactWorker.perform_async(saved_lab_id, 'SITCOM', saved_email)
    end
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

  def name
    [ first_name, last_name ].join(' ')
  end

  def sort_name
    ActiveSupport::Inflector.transliterate(
      [ last_name, first_name ].join(' ').downcase
    )
  end

  def path
    Rails.application.routes.url_helpers.lab_contact_path(lab, self)
  end

  def url
    Rails.application.routes.url_helpers.lab_contact_url(lab, self)
  end

  def scoped_path
    "#{self.class.name.parameterize.pluralize}/#{id}"
  end

  def address(html = false)
    separator = html ? '<br />' : "\n"
    [address_street, address_zip_code, address_city, address_country].reject(&:blank?).join(separator)
  end

  def mailchimp_upsert
    if lab.mailchimp_configured?
      Mailchimp::UpsertContactWorker.perform_async(lab_id, 'SITCOM', id)
    end
  end

  def association_ids
    {
      :organization_ids => organization_ids,
      :project_ids      => project_ids,
      :event_ids        => event_ids,
      :field_ids        => field_ids,
      :tag_ids          => tag_ids,
    }
  end
end
