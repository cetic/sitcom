class EventsController < ApplicationController

  before_action :find_lab

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
          @event.index_dependent_rows
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
          @event.index_dependent_rows
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

        if @event.destroy_and_index_dependent_rows
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

  protected

  def strong_params
    params.require(:event).permit(:name, :description, :contact_ids => [])
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

end
