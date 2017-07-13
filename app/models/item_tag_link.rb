class ItemTagLink < ActiveRecord::Base

  # Associations

  belongs_to :item, :polymorphic => true, :touch => true
  belongs_to :tag

end
