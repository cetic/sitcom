class ContactFieldLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :field

end
