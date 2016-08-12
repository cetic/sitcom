class CreateFields < ActiveRecord::Migration[5.0]
  def change
    create_table :fields do |t|
      t.references :parent, foreign_key: { to_table: 'fields' }
      t.string :name

      t.timestamps
    end
  end
end
