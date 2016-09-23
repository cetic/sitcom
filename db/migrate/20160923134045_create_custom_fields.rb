class CreateCustomFields < ActiveRecord::Migration[5.0]
  def change
    create_table :custom_fields do |t|
      t.references :lab, foreign_key: true

      t.string  :item_type, default: 'contact', index: true
      t.string  :name
      t.string  :field_type
      t.integer :position
      t.text    :options

      t.timestamps
    end
  end
end
