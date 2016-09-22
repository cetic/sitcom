class SavedSearchesController < ApplicationController

  before_action :find_lab

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?(params[:item_type].pluralize)
          @saved_searches = @lab.saved_searches.where(
            :item_type => params[:item_type],
            :user_id   => [ nil, current_user.id ]
          )
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
    if PermissionsService.new(current_user, @lab).can_write?(params[:item_type].pluralize)
      respond_to do |format|
        format.json do
          @saved_search = @lab.saved_searches.new(strong_params.merge(
            :item_type => params[:item_type],
            :user_id   => params[:public] == 'true' ? nil : current_user.id
          ))

          if @saved_search.save!
            render_json_success({
              :saved_search => {
                :id => @saved_search.id
              }
            })
          else
            render_json_errors(@saved_search)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def destroy
    if PermissionsService.new(current_user, @lab).can_write?(params[:item_type].pluralize)
      respond_to do |format|
        format.json do
          @saved_search = @lab.saved_searches.where(:item_type => params[:item_type])
                                             .find(params[:id])

          if @saved_search.destroy
            render_json_success
          else
            render_json_errors(@saved_search)
          end
        end
      end
    else
      render_permission_error
    end
  end

  private

  def strong_params
    params.require(:saved_search).permit(
      :name, :search, :user_id
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
  end
end
