class ContactFieldLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :field

  # Validations

  validates_uniqueness_of :contact_id, :scope => :field_id

end
