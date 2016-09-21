class SavedSearch < ApplicationRecord

  # Associations

  belongs_to :lab
  belongs_to :user

  # Validations

  validates :name, :presence => { :message => "Le nom est obligatoire."  }

end
