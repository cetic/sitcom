class CreateContactEventLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :contact_event_links do |t|
      t.references :contact, foreign_key: true
      t.references :event, foreign_key: true

      t.timestamps
    end
  end
end
