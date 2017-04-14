class OrganizationProjectLinksController < ApplicationController

  before_action :find_lab

  def update
    if PermissionsService.new(current_user, @lab).can_write?('organizations') ||
       PermissionsService.new(current_user, @lab).can_write?('projects')

      respond_to do |format|
        format.json do
          @organization_project_link = OrganizationProjectLink.find(params[:id])

          if @organization_project_link.organization.lab_id == @lab.id
            @organization_project_link.update_attributes!(strong_params)

            render_json_success
          else
            render_permission_error
          end
        end
      end
    else
      render_permission_error
    end
  end


  private

  def strong_params
    params.require(:organization_project_link).permit(:role)
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
