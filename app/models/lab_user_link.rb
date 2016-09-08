class LabUserLink < ApplicationRecord

  # Associations

  belongs_to :lab
  belongs_to :user

  # Methods

  def permissions
    {
      :can_read_contacts       => can_read_contacts,
      :can_write_contacts      => can_write_contacts,
      :can_read_organizations  => can_read_organizations,
      :can_write_organizations => can_write_organizations,
      :can_read_projects       => can_read_projects,
      :can_write_projects      => can_write_projects,
      :can_read_events         => can_read_events,
      :can_write_events        => can_write_events
    }
  end
end
