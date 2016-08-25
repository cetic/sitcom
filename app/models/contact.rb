class Contact < ApplicationRecord

  # Concerns

  include CommonIndexConcern
  include ContactIndexConcern
  include GravatarConcern

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :contact_organization_links, :dependent => :destroy
  has_many :organizations, :through => :contact_organization_links

  has_many :contact_field_links, :dependent => :destroy
  has_many :fields, :through => :contact_field_links

  has_many :contact_event_links, :dependent => :destroy
  has_many :events, :through => :contact_event_links

  has_many :contact_project_links, :dependent => :destroy
  has_many :projects, :through => :contact_project_links

  has_many :notes, :as => :notable

  # Validations

  validates :first_name, :presence => { :message => "Le prénom est obligatoire."  }
  validates :last_name,  :presence => { :message => "Le nom de famille est obligatoire."  }

  validates :first_name, :uniqueness => { :scope => :last_name, :message => 'Le nom indiqué existe déjà' }

  # Methods

  def index_dependent_rows(and_destroy = false)
    saved_organization_ids = organization_ids
    saved_event_ids        = event_ids
    saved_project_ids      = project_ids

    destroy! if and_destroy

    Organization.where(id: saved_organization_ids).each do |row|
      row.__elasticsearch__.index_document
    end

    Event.where(id: saved_event_ids).each do |row|
      row.__elasticsearch__.index_document
    end

    Project.where(id: saved_project_ids).each do |row|
      row.__elasticsearch__.index_document
    end
  end

  def destroy_and_index_dependent_rows
    index_dependent_rows(true)
  end

  def name
    [ first_name, last_name ].join(' ')
  end

  def address(html = false)
    separator = html ? '<br />' : "\n"
    [address_street, address_zip_code, address_city, address_country].reject(&:blank?).join(separator)
  end

  def picture_url
    if picture.present?
      picture.url
    elsif email.present?
      gravatar_url(:size => 130)
    else
      # default url
    end
  end
end
