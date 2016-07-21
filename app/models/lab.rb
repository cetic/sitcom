class Lab < ApplicationRecord

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  },
                   :uniqueness => { :message => "Ce nom est déjà utilisé." }

  # Callbacks

  before_save do
    self.slug = name.slugify
  end

  # Methods

end
