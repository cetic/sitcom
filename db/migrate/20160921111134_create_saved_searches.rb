class CreateSavedSearches < ActiveRecord::Migration[5.0]
  def change
    create_table :saved_searches do |t|
      t.references :lab,  foreign_key: true
      t.references :user, foreign_key: true

      t.string :name
      t.string :item_type
      t.text   :search

      t.timestamps
    end
  end
end
