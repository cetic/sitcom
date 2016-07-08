class User < ApplicationRecord

  # Constants

  # Devise

  devise :database_authenticatable, :recoverable,
         :rememberable, :trackable, :validatable

  # Associations

  # Validations

  # Callbacks

  # Methods

  # Class Methods
end
