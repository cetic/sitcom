class Contact < ApplicationRecord

  # Concerns

  include CommonIndexConcern
  include ContactIndexConcern
  include GravatarConcern

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :contact_tag_links, :dependent => :destroy
  has_many :tags, :through   => :contact_tag_links

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

  # Callbacks

  # Methods

  def name
    [ first_name, last_name ].join(' ')
  end

  def path
    Rails.application.routes.url_helpers.lab_contact_path(lab, self)
  end

  def scoped_path
    "#{self.class.name.parameterize.pluralize}/#{id}"
  end

  def address(html = false)
    separator = html ? '<br />' : "\n"
    [address_street, address_zip_code, address_city, address_country].reject(&:blank?).join(separator)
  end

  def picture_url(size = nil)
    if picture.present?
      size ? picture.url(size) : picture.url
    else
      txt = "#{first_name.first}#{last_name.first}"
      "https://placeholdit.imgix.net/~text?txtsize=68&txt=#{txt}&w=200&h=200"
    end
  end
end
