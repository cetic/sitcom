class AddBillingInfosToLabs < ActiveRecord::Migration[6.0]
  def change
    add_column :labs, :vat_number, :string, default: ''
    add_column :labs, :address1,   :string, default: ''
    add_column :labs, :address2,   :string, default: ''
    add_column :labs, :city,       :string, default: ''
    add_column :labs, :state,      :string, default: ''
    add_column :labs, :zip,        :string, default: ''
    add_column :labs, :country,    :string, default: ''
  end
end
