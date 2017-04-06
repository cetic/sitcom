class EventOrganizationLink < ApplicationRecord

  # Associations

  belongs_to :event,        :touch => true
  belongs_to :organization, :touch => true

  # Validations

  validates_uniqueness_of :event_id, :scope => :organization_id

  # Methods

  def path
    "/#{event.lab.slug}/#{self.class.name.pluralize.underscore}/#{id}"
  end
end
