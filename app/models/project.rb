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

  # Methods

end
