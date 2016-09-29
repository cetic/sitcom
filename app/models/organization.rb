class Organization < ApplicationRecord

  # Concerns

  include CommonIndexConcern
  include OrganizationIndexConcern
  include CableActionsConcern

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :contact_organization_links, :dependent => :destroy
  has_many :contacts, :through => :contact_organization_links

  has_many :notes, :as => :notable

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  },
                   :uniqueness => { :message => "Le nom indiqué existe déjà." }

  validates :website_url, :format      => { :with => URI::regexp(%w(http https)), :message => "L'adresse du site Web est invalide." },
                          :allow_blank => true

  # Callbacks

  after_commit   :after_create_callback, on: :create
  after_commit   :after_update_callback, on: :update
  around_destroy :around_destroy_callback

  def after_create_callback
    # websockets
    cable_create
    contacts.each(&:cable_update)

    # elasticsearch
    ReindexOrganizationWorker.perform_async(id)
  end

  def after_update_callback
    # websockets
    cable_update
    contacts.each(&:cable_update)

    # elasticsearch
    ReindexOrganizationWorker.perform_async(id)
  end

  def around_destroy_callback
    saved_id          = id
    saved_contact_ids = contacts.pluck(:id)

    yield

    # websockets
    cable_destroy
    Contact.where(:id => saved_contact_ids).each(&:cable_update)

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
end
