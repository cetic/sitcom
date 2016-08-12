class ContactProjectLink < ApplicationRecord

  # Associations

  belongs_to :contact
  belongs_to :project

end
