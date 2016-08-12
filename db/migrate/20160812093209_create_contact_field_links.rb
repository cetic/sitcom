class CreateContactFieldLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :contact_field_links do |t|
      t.references :contact, foreign_key: true
      t.references :field,   foreign_key: true

      t.timestamps
    end
  end
end
