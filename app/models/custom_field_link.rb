class CustomFieldLink < ApplicationRecord

  # Associations

  belongs_to :custom_field

  belongs_to :item, :polymorphic => true

  # Methods

  def value
    if custom_field.field_type == 'boolean'
      boolean_value
    else
      text_value
    end
  end
end
