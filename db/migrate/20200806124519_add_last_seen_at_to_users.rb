class AddLastSeenAtToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :last_seen_at, :datetime, :after => :updated_at

    User.reset_column_information

    User.all.each do |user|
      if user.current_sign_in_at
        user.update_column(:last_seen_at, user.current_sign_in_at)
      else
        user.update_column(:last_seen_at, user.created_at)
      end
    end

    add_index :users, :last_seen_at
  end
end
