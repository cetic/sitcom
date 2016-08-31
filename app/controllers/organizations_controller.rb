class OrganizationsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.json do
        organizations = OrganizationSearch.new(params.merge({
          :lab_id => @lab.id
        })).run

        render :json => {
          :organizations => organizations
        }
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        @organization = @lab.organizations.find(params[:id])
        render :json => @organization.as_indexed_json
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @organization = @lab.organizations.new(strong_params)

        if @organization.save
          @organization.index_dependent_rows
          render_json_success({ :organization => @organization.as_indexed_json })
        else
          render_json_errors(@organization)
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @organization = @lab.organizations.find(params[:id])

        if @organization.update_attributes(strong_params)
          @organization.index_dependent_rows
          render_json_success
        else
          render_json_errors(@organization)
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @organization = @lab.organizations.find(params[:id])

        if @organization.destroy_and_index_dependent_rows
          render_json_success
        else
          render_json_errors(@organization)
        end
      end
    end
  end

  def options
    @organizations = @lab.organizations.order(:name)
  end

  def status_options
    @statuses = @lab.organizations.pluck(:status).uniq.reject(&:blank?)
  end

  private

  # Encapsulate new picture in "organization" (don't know how to make it in JS)
  def clean_params
    params[:organization] ||= {}
    params[:organization][:picture] = params[:picture]
    params.delete(:picture)
  end

  def strong_params
    params.require(:organization).permit(
      :name, :status, :description, :website_url,
      :picture,
      :contact_ids => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
