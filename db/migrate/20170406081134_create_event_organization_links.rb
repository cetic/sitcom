class CreateEventOrganizationLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :event_organization_links do |t|
      t.references :event, foreign_key: true
      t.string     :role, default: ''
      t.references :organization, foreign_key: true

      t.timestamps
    end
  end
end
