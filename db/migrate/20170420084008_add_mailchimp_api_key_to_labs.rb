class AddMailchimpApiKeyToLabs < ActiveRecord::Migration[5.0]
  def change
    add_column :labs, :mailchimp_api_key, :string, after: 'slug'
  end
end
