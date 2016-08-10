class LabsController < ApplicationController

  before_action :find_lab_from_cookies, :only => [:index]
  before_action :find_lab,              :only => [:show]

  def index
    if @lab
      redirect_to lab_contacts_path(@lab)
    else
      @labs = current_user.labs
    end
  end

  def show
    redirect_to lab_contacts_path(@lab)
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:id])
    save_lab_in_cookies(@lab)
  end
end
