class CreateContactTagLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :contact_tag_links do |t|
      t.references :contact, :index => true
      t.references :tag,     :index => true

      t.timestamps
    end
  end
end
