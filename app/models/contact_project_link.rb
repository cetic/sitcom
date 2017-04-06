class ContactProjectLink < ApplicationRecord

  # Associations

  belongs_to :contact, :touch => true
  belongs_to :project, :touch => true

  # Validations

  validates_uniqueness_of :contact_id, :scope => :project_id

  # Methods

  def path
    "/#{contact.lab.slug}/#{self.class.name.pluralize.underscore}/#{id}"
  end
end
