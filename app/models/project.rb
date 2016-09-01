class Project < ApplicationRecord

  # Concerns

  include CommonIndexConcern
  include ProjectIndexConcern

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :contact_project_links, :dependent => :destroy
  has_many :contacts, :through => :contact_project_links

  has_many :notes, :as => :notable

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  }
  validates :name, :uniqueness => { :message => "Le nom indiqué existe déjà." }

  # Methods

  def path
    Rails.application.routes.url_helpers.lab_project_path(lab, self)
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
