class CreateDocuments < ActiveRecord::Migration[5.0]
  def change
    create_table :documents do |t|
      t.references :user, :foreign_key => true
      t.references :uploadable
      t.string     :uploadable_type
      t.text       :description
      t.string     :privacy

      t.timestamps
    end
  end
end
