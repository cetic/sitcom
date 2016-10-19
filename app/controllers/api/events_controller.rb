class Api::EventsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(current_user, @lab).can_read?('events')
      if params[:contact_id]
        @contact = @lab.contacts.find(params[:contact_id])
        @events  = @contact.events
      else
        @events = @lab.events
      end
    else
      render_permission_error
    end
  end

end
