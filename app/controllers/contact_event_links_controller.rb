class ContactEventLinksController < ApplicationController

  before_action :find_lab

  def update
    if PermissionsService.new(current_user, @lab).can_write?('contacts') ||
       PermissionsService.new(current_user, @lab).can_write?('events')

      respond_to do |format|
        format.json do
          @contact_event_link = ContactEventLink.find(params[:id])

          if @contact_event_link.contact.lab_id == @lab.id
            @contact_event_link.update!(strong_params)

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
       PermissionsService.new(current_user, @lab).can_read?('events')

      respond_to do |format|
        format.json do
          render :json => {
            :roles => ContactEventLink.includes(:contact)
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
    params.require(:contact_event_link).permit(:role)
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
