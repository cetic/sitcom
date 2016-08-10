class LabUserLink < ApplicationRecord

  # Associations

  belongs_to :lab
  belongs_to :user

end
