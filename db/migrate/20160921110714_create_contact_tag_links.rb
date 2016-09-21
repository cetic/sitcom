class CreateContactTagLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :contact_tag_links do |t|
      t.references :contact, :foreign_key => true
      t.references :tag,     :foreign_key => true

      t.timestamps
    end
  end
end
