class EventOrganizationLink < ApplicationRecord

  # Associations

  belongs_to :event
  belongs_to :organization

  # Validations

  validates_uniqueness_of :event_id, :scope => :organization_id

end
