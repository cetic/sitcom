class Api::ProjectsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(current_user, @lab).can_read?('projects')
      if params[:contact_id]
        @contact  = @lab.contacts.find(params[:contact_id])
        @projects = @contact.projects
      else
        @projects = @lab.projects
      end
    else
      render_permission_error
    end
  end

end
