class EventsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('events')
          events = EventSearch.new(current_user, params.merge({
            :lab_id => @lab.id
          })).run

          if params[:only_ids]
            render :json => {
              :event_ids => events
            }
          else
            render :json => {
              :events => events
            }
          end
        else
          render_permission_error
        end
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('events')
          @event = @lab.events.find(params[:id])
          render :json => BaseSearch.reject_private_notes_from_result(@event.as_indexed_json)
        else
          render_permission_error
        end
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def create
    if PermissionsService.new(current_user, @lab).can_write?('events')
      respond_to do |format|
        format.json do
          @event = @lab.events.new(strong_params)

          if @event.save
            LogEntry.log_create(current_user, @event)

            render_json_success({ :event_id => @event.id })
          else
            render_json_errors(@event)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def update
    if PermissionsService.new(current_user, @lab).can_write?('events')
      respond_to do |format|
        format.json do
          @event                   = @lab.events.find(params[:id])
          previous_association_ids = @event.association_ids

          if @event.update_attributes(strong_params)
            LogEntry.log_update(current_user, @event, previous_association_ids)

            render_json_success
          else
            render_json_errors(@event)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def destroy
    if PermissionsService.new(current_user, @lab).can_write?('events')
      respond_to do |format|
        format.json do
          @event = @lab.events.find(params[:id])

          if @event.destroy
            LogEntry.log_destroy(current_user, @event)

            render_json_success
          else
            render_json_errors(@event)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def options
    @events = @lab.events.order(:name)
  end

  private

  # Encapsulate new picture in "event" (don't know how to make it in JS)
  def clean_params
    params[:event] ||= {}
    params[:event][:picture] = params[:picture]
    params.delete(:picture)
  end

  def strong_params
    params.require(:event).permit(
      :name, :description, :place, :happens_on, :website_url,
      :picture,
      :contact_ids => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

end
