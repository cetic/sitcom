class ContactTagLink < ActiveRecord::Base
  belongs_to :contact, :touch => true
  belongs_to :tag
end
