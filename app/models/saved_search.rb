class SavedSearch < ApplicationRecord

  # Associations

  belongs_to :lab
  belongs_to :user, :optional => true

  # Validations

  validates :name, :presence => { :message => "Le nom est obligatoire."  }

end
