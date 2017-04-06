class OrganizationProjectLink < ApplicationRecord

  # Associations

  belongs_to :organization
  belongs_to :project

  # Validations

  validates_uniqueness_of :organization_id, :scope => :project_id

end
