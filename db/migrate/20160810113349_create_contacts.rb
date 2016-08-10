class CreateContacts < ActiveRecord::Migration[5.0]
  def change
    create_table :contacts do |t|
      t.references :lab, :foreign_key => true

      t.string :last_name,        :default => ''
      t.string :first_name,       :default => ''
      t.string :email,            :default => ''
      t.string :address_street,   :default => ''
      t.string :address_zip_code, :default => ''
      t.string :address_city,     :default => ''
      t.string :address_country,  :default => ''
      t.string :phone,            :default => ''

      t.boolean :active

      t.string :twitter_url,  :default => ''
      t.string :linkedin_url, :default => ''
      t.string :facebook_url, :default => ''
      t.string :website_url,  :default => ''

      t.timestamps
    end
  end
end
