class CreateOrganizations < ActiveRecord::Migration[5.0]
  def change
    create_table :organizations do |t|
      t.references :lab, :foreign_key => true

      t.string :name,        :default => ''
      t.string :status,      :default => ''
      t.text   :description
      t.string :website_url, :default => ''

      t.timestamps
    end
  end
end
