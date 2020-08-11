class AddLastSeenAtToUserLabLinks < ActiveRecord::Migration[6.0]
  def change
    add_column :lab_user_links, :last_seen_at, :datetime, :after => :updated_at
    add_column :labs,           :stats,        :text,     :after => :account_type

    LabUserLink.reset_column_information

    LabUserLink.all.each do |lab_user_link|
      lab_user_link.update_column(:last_seen_at, lab_user_link.created_at)
    end

    add_index :lab_user_links, :last_seen_at
  end
end
