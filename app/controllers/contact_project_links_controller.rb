class ContactProjectLinksController < ApplicationController

  before_action :find_lab

  def update
    if PermissionsService.new(current_user, @lab).can_write?('contacts') ||
       PermissionsService.new(current_user, @lab).can_write?('projects')

      respond_to do |format|
        format.json do
          @contact_project_link = ContactProjectLink.find(params[:id])

          if @contact_project_link.contact.lab_id == @lab.id
            @contact_project_link.update_attributes!(strong_params)

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
       PermissionsService.new(current_user, @lab).can_read?('projects')

      respond_to do |format|
        format.json do
          render :json => {
            :roles => ContactProjectLink.includes(:contact)
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
    params.require(:contact_project_link).permit(:role)
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
