class ContactEventLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :event

  validates_uniqueness_of :contact_id, :scope => :event_id

end
