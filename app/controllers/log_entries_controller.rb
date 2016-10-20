class LogEntriesController < ApplicationController

  before_action :find_lab
  before_action :find_item
  before_action :find_item_type

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?(@item_type)
          @log_entries = @item.log_entries.order(:created_at => :desc)
          render
        else
          render_permission_error
        end
      end
    end
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

  def find_item_type
    @item_type = @item.class.name.pluralize.underscore
  end

  def find_item
    [:contact, :organization, :event, :project].each do |item_type|
      item_id = params["#{item_type}_id".to_sym]

      if item_id
        @item = @lab.send(item_type.to_s.pluralize.to_sym).find(item_id)
      end
    end
  end
end
