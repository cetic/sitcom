class TagsController < ApplicationController

  before_action :find_lab

  # create many tags at once
  def create
    if PermissionsService.new(current_user, @lab).can_write?('contacts')
      contacts = @lab.contacts.where(:id => params[:contact_ids])

      contacts.each do |contact|
        ContactTagService.new(contact).add_tag(params[:name])
      end

      render_json_success
    else
      render_permission_error
    end
  end

  # destroy only one tag
  def destroy
    if PermissionsService.new(current_user, @lab).can_write?('contacts')
      contact = @lab.contacts.find(params[:contact_id])

      ContactTagService.new(contact).remove_tag(params[:id])

      render_json_success
    else
      render_permission_error
    end
  end

  def options
    @tags = @lab.tags.order(:name)
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
