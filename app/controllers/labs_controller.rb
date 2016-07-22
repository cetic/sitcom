class LabsController < ApplicationController

  before_action :find_lab, :only => [:show]

  def index
    redirect_to "/#{Lab.first.slug}/contacts"
  end

  def show
    redirect_to lab_contacts_path(@lab)
  end

  def find_lab
    @lab = Lab.find_by_slug(params[:id])

    render_404 if @lab.blank?
  end
end
