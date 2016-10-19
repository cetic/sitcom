class Api::TagsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(current_user, @lab).can_read?('contacts')
      if params[:contact_id]
        @contact = @lab.contacts.find(params[:contact_id])
        @tags    = @contact.tags
      else
        @tags = @lab.tags
      end
    else
      render_permission_error
    end
  end

end
