class EventProjectLink < ApplicationRecord

  # Associations

  belongs_to :event
  belongs_to :project

  # Validations

  validates_uniqueness_of :event_id, :scope => :project_id

end
