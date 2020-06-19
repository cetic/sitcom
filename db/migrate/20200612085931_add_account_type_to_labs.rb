class AddAccountTypeToLabs < ActiveRecord::Migration[6.0]
  def change
    add_column :labs, :account_type, :string, default: 'basic'

    Lab.update_all(:account_type => 'premium')
  end
end
