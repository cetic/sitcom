class ContactTagLink < ActiveRecord::Base

  # Associations

  belongs_to :contact, :touch => true
  belongs_to :tag

end
