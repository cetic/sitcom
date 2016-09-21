class TagsController < ApplicationController

  before_action :find_lab
  before_action :find_contact, :only => [ :create, :destroy ]

  def create
    ContactTagService.new(@contact).add_tag(params[:name])
    render_json_success
  end

  def destroy
    ContactTagService.new(@contact).remove_tag(params[:id])
    render_json_success
  end

  def options
    @tags = @lab.tags.order(:name)
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

  def find_contact
    @contact = @lab.contacts.find(params[:contact_id])
  end
end
