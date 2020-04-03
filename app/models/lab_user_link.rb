class LabUserLink < ApplicationRecord

  # Associations

  belongs_to :lab
  belongs_to :user

  # Methods

  def permissions
    admin_or_manager = user.admin? || user.lab_manager_of?(lab)

    {
      :can_read_contacts       => admin_or_manager || can_read_contacts,
      :can_write_contacts      => admin_or_manager || can_write_contacts,
      :can_read_organizations  => admin_or_manager || can_read_organizations,
      :can_write_organizations => admin_or_manager || can_write_organizations,
      :can_read_projects       => admin_or_manager || can_read_projects,
      :can_write_projects      => admin_or_manager || can_write_projects,
      :can_read_events         => admin_or_manager || can_read_events,
      :can_write_events        => admin_or_manager || can_write_events
    }
  end
end
