class ContactOrganizationLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :organization

  # Validations

  validates_uniqueness_of :contact_id, :scope => :organization_id

end
