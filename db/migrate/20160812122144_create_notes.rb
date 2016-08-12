class CreateNotes < ActiveRecord::Migration[5.0]
  def change
    create_table :notes do |t|
      t.references :notable
      t.string     :notable_type
      t.text       :text
      t.string     :privacy

      t.timestamps
    end
  end
end
