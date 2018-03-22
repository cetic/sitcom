class EventProjectLinksController < ApplicationController

  before_action :find_lab

  def update
    if PermissionsService.new(current_user, @lab).can_write?('events') ||
       PermissionsService.new(current_user, @lab).can_write?('projects')

      respond_to do |format|
        format.json do
          @event_project_link = EventProjectLink.find(params[:id])

          if @event_project_link.event.lab_id == @lab.id
            @event_project_link.update_attributes!(strong_params)

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
    if PermissionsService.new(current_user, @lab).can_read?('events') ||
       PermissionsService.new(current_user, @lab).can_read?('projects')

      respond_to do |format|
        format.json do
          render :json => {
            :roles => EventProjectLink.includes(:event)
                                      .where(:events => { :lab_id => @lab.id })
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
    params.require(:event_project_link).permit(:role)
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
