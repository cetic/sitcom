class PermissionsService

  # Constanrs

  MODULES = {
    'contacts'      => 'Contacts',
    'organizations' => 'Organisations',
    'projects'      => 'Projets',
    'events'        => 'Evènements'
  }

  # Attributes

  attr_accessor :user, :lab, :lab_user_link

  # Methods

  def initialize(user, lab)
    @user          = user
    @lab           = lab
    @lab_user_link = @user.lab_user_links.where(lab_id: @lab.id).first
  end

  def can_access_lab?
    @lab_user_link.present?
  end

  def lab_manager_of_lab?
    can_access_lab? && user.lab_manager?
  end

  def can_read?(module_key)
    user.admin? || lab_manager_of_lab? || (can_access_lab? && lab_user_link.send("can_read_#{module_key}?".to_sym))
  end

  def can_write?(module_key)
    user.admin? || lab_manager_of_lab? || user.lab_manager? || (can_access_lab? && lab_user_link.send("can_write_#{module_key}?".to_sym))
  end
end
