class Api::EventsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(@current_user, @lab).can_read?('events')
      if params[:contact_id]
        @contact = @lab.contacts.find(params[:contact_id])
        @events  = @contact.events.page(params[:page]).per(PER_PAGE)
      else
        @events = @lab.events.page(params[:page]).per(PER_PAGE)
      end
    else
      render_permission_error
    end
  end

  def show
    if PermissionsService.new(@current_user, @lab).can_read?('events')
      @event = @lab.events.find(params[:id])
    else
      render_permission_error
    end
  end
end
