class ContactOrganizationLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :organization

end
