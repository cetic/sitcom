class CreateItemUserLinks < ActiveRecord::Migration[6.0]
  def change
    create_table :item_user_links do |t|
      t.references :user, foreign_key: true, type: :integer
      t.integer    :item_id,                       index: true
      t.string     :item_type, default: 'Contact', index: true

      t.timestamps
    end
  end
end
