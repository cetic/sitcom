class CreateContactProjectLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :contact_project_links do |t|
      t.references :contact, foreign_key: true
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
