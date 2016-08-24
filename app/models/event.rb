class Event < ApplicationRecord

  # Concerns

  include CommonIndexConcern
  include EventIndexConcern

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :contact_event_links, :dependent => :destroy
  has_many :contacts, :through => :contact_event_links

  has_many :notes, :as => :notable

  # Validations

  validates :name, :presence => { :message => "Le nom est obligatoire."  }

  # Methods

  def index_dependent_rows
    contacts.each { |row| row.__elasticsearch__.index_document }
  end
end
