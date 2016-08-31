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

  validates :first_name, :presence   => { :message => "Le prénom est obligatoire."  },
                         :uniqueness => { :scope => :last_name, :message => 'Le nom indiqué existe déjà' }

  validates :last_name,  :presence => { :message => "Le nom de famille est obligatoire."  }

  validates :email, :format      => { :with => Devise.email_regexp, :message => "L'adresse email est invalide" },
                    :allow_blank => true

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
    else
      txt = "#{first_name.first}#{last_name.first}"
      "https://placeholdit.imgix.net/~text?txtsize=33&txt=#{txt}&w=130&h=130"
    end
  end
end
