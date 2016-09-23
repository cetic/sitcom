class CreateCustomFieldLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :custom_field_links do |t|
      t.references :custom_field, foreign_key: true

      t.string  :item_type, index: true
      t.integer :item_id,   index: true

      t.text    :text_value
      t.boolean :boolean_value, default: false

      t.timestamps
    end
  end
end
