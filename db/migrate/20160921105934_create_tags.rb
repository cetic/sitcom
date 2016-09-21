class CreateTags < ActiveRecord::Migration[5.0]
  def change
    create_table :tags do |t|
      t.references :lab, :index => true

      t.string :name
      t.string :color

      t.timestamps
    end
  end
end
