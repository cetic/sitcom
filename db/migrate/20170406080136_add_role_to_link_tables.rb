class AddRoleToLinkTables < ActiveRecord::Migration[5.0]
  def change
    add_column :contact_event_links,        :role, :string, default: '', after: :contact_id
    add_column :contact_organization_links, :role, :string, default: '', after: :contact_id
    add_column :contact_project_links,      :role, :string, default: '', after: :contact_id
  end
end
