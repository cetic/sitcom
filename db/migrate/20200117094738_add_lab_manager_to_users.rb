class AddLabManagerToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :lab_manager, :boolean, :default => false, :after => :admin
  end
end
