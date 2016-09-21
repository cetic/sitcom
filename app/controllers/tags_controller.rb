class TagsController < ApplicationController

  before_action :find_lab
  before_action :find_contact

  def create
    SegmentTagService.new(@contact).add_tag(params[:name])
    render_json_success
  end

  def destroy
    SegmentTagService.new(@contact).remove_tag(params[:id])
    render_json_success
  end

  private

  def find_contact
    @contact = @lab.contacts.find(params[:contact_id])
  end
end
