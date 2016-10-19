class Api::ContactsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(current_user, @lab).can_read?('contacts')
      @contacts = @lab.contacts
    else
      render_permission_error
    end
  end

end
