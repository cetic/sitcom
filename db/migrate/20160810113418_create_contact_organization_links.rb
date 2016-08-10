class CreateContactOrganizationLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :contact_organization_links do |t|
      t.references :contact,      foreign_key: true
      t.references :organization, foreign_key: true

      t.timestamps
    end
  end
end
