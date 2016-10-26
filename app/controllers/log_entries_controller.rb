class LogEntriesController < ApplicationController

  before_action :find_lab
  before_action :find_item

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?(@item_type)
          if @item
            @log_entries = @item.log_entries
          else # deleted item?
            @log_entries = @lab.log_entries.where(:item_id => @item_id, :item_type => @item_type.to_s.singularize.capitalize)
          end

          @log_entries = @log_entries.order(:created_at => :desc)
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

  def find_item
    [:contact, :organization, :event, :project].each do |item_type|
      item_id = params["#{item_type}_id".to_sym]

      if item_id
        @item_id   = item_id
        @item_type = item_type.to_s.pluralize.to_sym
        @item      = @lab.send(@item_type).where(:id => @item_id).first
      end
    end
  end
end
