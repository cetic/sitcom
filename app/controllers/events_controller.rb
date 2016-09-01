class EventsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.json do
        events = EventSearch.new(params.merge({
          :lab_id => @lab.id
        })).run

        render :json => {
          :events => events
        }
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        @event = @lab.events.find(params[:id])
        render :json => @event.as_indexed_json
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @event = @lab.events.new(strong_params)

        if @event.save
          render_json_success({ :event => @event.as_indexed_json })
        else
          render_json_errors(@event)
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @event = @lab.events.find(params[:id])

        if @event.update_attributes(strong_params)
          render_json_success
        else
          render_json_errors(@event)
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @event = @lab.events.find(params[:id])

        if @event.destroy
          render_json_success
        else
          render_json_errors(@event)
        end
      end
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
