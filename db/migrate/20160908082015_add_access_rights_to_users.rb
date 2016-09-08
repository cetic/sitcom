class AddAccessRightsToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :lab_user_links, :can_read_contacts,       :boolean, default: true,  after: :user_id
    add_column :lab_user_links, :can_write_contacts,      :boolean, default: false, after: :can_read_contacts
    add_column :lab_user_links, :can_read_organizations,  :boolean, default: true,  after: :can_write_contacts
    add_column :lab_user_links, :can_write_organizations, :boolean, default: false, after: :can_read_organizations
    add_column :lab_user_links, :can_read_projects,       :boolean, default: true,  after: :can_write_organizations
    add_column :lab_user_links, :can_write_projects,      :boolean, default: false, after: :can_read_projects
    add_column :lab_user_links, :can_read_events,         :boolean, default: true,  after: :can_write_projects
    add_column :lab_user_links, :can_write_events,        :boolean, default: false, after: :can_read_events
  end
end
