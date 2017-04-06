class OrganizationProjectLink < ApplicationRecord

  # Associations

  belongs_to :organization, :touch => true
  belongs_to :project,      :touch => true

  # Validations

  validates_uniqueness_of :organization_id, :scope => :project_id

  # Methods

  def path
    "/#{organization.lab.slug}/#{self.class.name.pluralize.underscore}/#{id}"
  end
end
