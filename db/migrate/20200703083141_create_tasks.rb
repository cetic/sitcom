class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.references :item, polymorphic: true
      t.references :user

      t.string :name
      t.text   :text

      t.date     :execution_date
      t.datetime :done_at

      t.timestamps
    end
  end
end
