class Api::OrganizationsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(@current_user, @lab).can_read?('organizations')
      if params[:contact_id]
        @contact       = @lab.contacts.find(params[:contact_id])
        @organizations = @contact.organizations.page(params[:page]).per(PER_PAGE)
      else
        @organizations = @lab.organizations.page(params[:page]).per(PER_PAGE)
      end
    else
      render_permission_error
    end
  end

  def show
    if PermissionsService.new(@current_user, @lab).can_read?('organizations')
      @organization = @lab.organizations.find(params[:id])
    else
      render_permission_error
    end
  end
end
