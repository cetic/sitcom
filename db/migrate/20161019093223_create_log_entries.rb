class CreateLogEntries < ActiveRecord::Migration[5.0]
  def change
    create_table :log_entries do |t|
      t.references :lab,  foreign_key: true
      t.references :user, foreign_key: true

      t.string :user_name # in case of user deletion

      t.string :action

      t.string  :item_type, index: true
      t.integer :item_id,   index: true

      t.text :content, :limit => 4294967295

      t.timestamps
    end
  end
end
