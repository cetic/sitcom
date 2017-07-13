class TagsController < ApplicationController

  before_action :find_lab

  # create many tags at once
  def create
    item_types = params[:item_type].downcase + 's'

    if PermissionsService.new(current_user, @lab).can_write?(item_types)
      items = @lab.send(item_types).where(:id => params[:item_ids])

      items.each do |item|
        ItemTagService.new(current_user, item).add_tag(params[:name])
      end

      render_json_success({
        :items => items.collect { |item| item.as_indexed_json }
      })
    else
      render_permission_error
    end
  end

  # destroy only one tag
  def destroy
    item_types = params[:item_type].downcase + 's'

    if PermissionsService.new(current_user, @lab).can_write?(item_types)
      item = @lab.send(item_types).find(params[:item_id])

      ItemTagService.new(current_user, item).remove_tag(params[:id])

      render_json_success({ :item => item.as_indexed_json })
    else
      render_permission_error
    end
  end

  def options
    @tags = @lab.tags.where(:item_type => params[:item_type]).order(:name)
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
