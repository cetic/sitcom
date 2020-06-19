class ItemUserLink < ActiveRecord::Base

  # Associations

  belongs_to :item, :polymorphic => true
  belongs_to :user

  # Validations

  validates_uniqueness_of :item_id, :scope => :user_id

end
