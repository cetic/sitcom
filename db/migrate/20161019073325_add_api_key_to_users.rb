class AddApiKeyToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :api_key, :string, :index => true,
                                          :after => :email

    User.find_each do |user|
      user.set_new_api_key
      user.save!
    end
  end
end
