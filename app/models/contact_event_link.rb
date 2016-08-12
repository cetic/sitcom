class ContactEventLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :event

end
