class CreateProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :projects do |t|
      t.references :lab, foreign_key: true

      t.string :name
      t.text   :description
      t.date   :start_date
      t.date   :end_date

      t.string :picture

      t.timestamps
    end
  end
end
