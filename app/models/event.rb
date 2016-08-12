class Event < ApplicationRecord

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :contact_event_links, :dependent => :destroy
  has_many :contacts, :through => :contact_event_links

  has_many :notes, :as => :notable

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  }
end
