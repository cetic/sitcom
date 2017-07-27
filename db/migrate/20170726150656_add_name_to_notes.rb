class AddNameToNotes < ActiveRecord::Migration[5.0]
  def change
    add_column :notes, :name, :string, :after => :notable_type
  end
end
