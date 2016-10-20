class Api::ProjectsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(@current_user, @lab).can_read?('projects')
      if params[:contact_id]
        @contact  = @lab.contacts.find(params[:contact_id])
        @projects = @contact.projects.page(params[:page]).per(PER_PAGE)
      else
        @projects = @lab.projects.page(params[:page]).per(PER_PAGE)
      end
    else
      render_permission_error
    end
  end

  def show
    if PermissionsService.new(@current_user, @lab).can_read?('projects')
      @project = @lab.projects.find(params[:id])
    else
      render_permission_error
    end
  end
end
