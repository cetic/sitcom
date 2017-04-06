class CreateOrganizationProjectLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :organization_project_links do |t|
      t.references :organization, foreign_key: true
      t.string     :role, default: ''
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
