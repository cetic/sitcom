class CreateLabUserLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :lab_user_links do |t|
      t.references :lab, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
