class ContactProjectLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :project

  validates_uniqueness_of :contact_id, :scope => :project_id

end
