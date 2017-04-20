class AddOtherMailchimpFieldsToLabs < ActiveRecord::Migration[5.0]
  def change
    add_column :labs, :mailchimp_company,    :string, after: 'mailchimp_api_key'
    add_column :labs, :mailchimp_from_email, :string, after: 'mailchimp_company'
    add_column :labs, :mailchimp_address1,   :string, after: 'mailchimp_from_email'
    add_column :labs, :mailchimp_address2,   :string, after: 'mailchimp_address1'
    add_column :labs, :mailchimp_city,       :string, after: 'mailchimp_address2'
    add_column :labs, :mailchimp_state,      :string, after: 'mailchimp_city'
    add_column :labs, :mailchimp_zip,        :string, after: 'mailchimp_state'
    add_column :labs, :mailchimp_country,    :string, after: 'mailchimp_zip'
  end
end
