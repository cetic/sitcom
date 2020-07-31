class AddMoreFieldsToOrganizations < ActiveRecord::Migration[6.0]
  def change
    add_column :organizations, :company_number, :string, default: ''
    add_column :organizations, :address1,       :string, default: ''
    add_column :organizations, :address2,       :string, default: ''
    add_column :organizations, :city,           :string, default: ''
    add_column :organizations, :state,          :string, default: ''
    add_column :organizations, :zip,            :string, default: ''
    add_column :organizations, :country,        :string, default: ''

    add_column :organizations, :twitter_url,  :string, default: ''
    add_column :organizations, :facebook_url, :string, default: ''
    add_column :organizations, :linkedin_url, :string, default: ''
  end
end
