class OrganizationsController < ApplicationController
  before_action :find_lab

  def index
    respond_to do |format|
      format.html

      format.json do
        organizations = OrganizationSearch.new(params.merge({
          :lab_id => @lab.id
        })).run

        render :json => {
          :organizations => organizations
        }
      end
    end
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
