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

  def index_dependent_rows(and_destroy = false)
    saved_contact_ids = contact_ids

    destroy! if and_destroy

    Contact.where(id: saved_contact_ids).each do |row|
      row.__elasticsearch__.index_document
    end
  end

  def destroy_and_index_dependent_rows
    index_dependent_rows(true)
  end
end
