class CustomFieldLink < ApplicationRecord

  # Associations

  belongs_to :custom_field

  belongs_to :item, :polymorphic => true

  # Methods

end
