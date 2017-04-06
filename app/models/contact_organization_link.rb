class ContactOrganizationLink < ApplicationRecord

  # Associations

  belongs_to :contact,      :touch => true
  belongs_to :organization, :touch => true

  # Validations

  validates_uniqueness_of :contact_id, :scope => :organization_id

  # Methods

  def path
    "/#{contact.lab.slug}/#{self.class.name.pluralize.underscore}/#{id}"
  end
end
