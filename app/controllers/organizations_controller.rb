class OrganizationsController < ApplicationController
  def index
    respond_to do |format|
      format.html

      format.json do
        organizations = OrganizationSearch.new(params.merge({
          :lab_id => current_lab.id
        })).run

        render :json => {
          :organizations => organizations
        }
      end
    end
  end
end
