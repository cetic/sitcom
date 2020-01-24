class ContactOrganizationLinksController < ApplicationController

  before_action :find_lab

  def update
    if PermissionsService.new(current_user, @lab).can_write?('contacts') ||
       PermissionsService.new(current_user, @lab).can_write?('organizations')

      respond_to do |format|
        format.json do
          @contact_organization_link = ContactOrganizationLink.find(params[:id])

          if @contact_organization_link.contact.lab_id == @lab.id
            @contact_organization_link.update!(strong_params)

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

  def options
    if PermissionsService.new(current_user, @lab).can_read?('contacts') ||
       PermissionsService.new(current_user, @lab).can_read?('organizations')

      respond_to do |format|
        format.json do
          render :json => {
            :roles => ContactOrganizationLink.includes(:contact)
                                             .where(:contacts => { :lab_id => @lab.id })
                                             .pluck(:role)
                                             .reject(&:empty?)
                                             .uniq
                                             .sort
          }
        end
      end
    else
      render_permission_error
    end
  end

  private

  def strong_params
    params.require(:contact_organization_link).permit(:role)
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
