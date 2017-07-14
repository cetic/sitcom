class AddItemTypeToTags < ActiveRecord::Migration[5.0]
  def change
    add_column :tags, :item_type, :string, :after => :color, :default => 'Contact', :index => true
  end
end
