class EventProjectLink < ApplicationRecord

  # Associations

  belongs_to :event,   :touch => true
  belongs_to :project, :touch => true

  # Validations

  validates_uniqueness_of :event_id, :scope => :project_id

  # Methods

  def path
    "/#{event.lab.slug}/#{self.class.name.pluralize.underscore}/#{id}"
  end
end
