class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.references :lab, foreign_key: true

      t.string :name
      t.date   :happens_on
      t.string :place
      t.text   :description
      t.string :website_url

      t.string :picture

      t.timestamps
    end
  end
end
