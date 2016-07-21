class Lab < ApplicationRecord

  # Validations

  validates :name, :presence => { :message => "Le nom est obligatoire." }

end
