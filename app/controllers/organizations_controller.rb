class OrganizationsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('organizations')
          organizations = OrganizationSearch.new(current_user, params.merge({
            :lab_id => @lab.id
          })).run

          if params[:only_ids]
            render :json => {
              :organization_ids => organizations
            }
          else
            render :json => {
              :organizations => organizations
            }
          end
        else
          render_permission_error
        end
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('organizations')
          @organization = @lab.organizations.find(params[:id])
          render :json => BaseSearch.reject_private_notes_from_result(@organization.as_indexed_json, current_user)
        else
          render_permission_error
        end
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def create
    if PermissionsService.new(current_user, @lab).can_write?('organizations')
      respond_to do |format|
        format.json do
          @organization = @lab.organizations.new(strong_params)

          if @organization.save
            render_json_success({ :organization_id => @organization.id })
          else
            render_json_errors(@organization)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def update
    if PermissionsService.new(current_user, @lab).can_write?('organizations')
      respond_to do |format|
        format.json do
          @organization = @lab.organizations.find(params[:id])

          if @organization.update_attributes(strong_params)
            render_json_success
          else
            render_json_errors(@organization)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def destroy
    if PermissionsService.new(current_user, @lab).can_write?('organizations')
      respond_to do |format|
        format.json do
          @organization = @lab.organizations.find(params[:id])

          if @organization.destroy
            render_json_success
          else
            render_json_errors(@organization)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def options
    @organizations = @lab.organizations.order(:name)
  end

  def status_options
    @statuses = @lab.organizations.pluck(:status).uniq.reject(&:blank?)
  end

  def export
    if PermissionsService.new(current_user, @lab).can_read?('organizations')
      organizations = OrganizationSearch.new(current_user, params.merge({
        :lab_id => @lab.id
      })).run

      render_csv(OrganizationExport.new(@lab, organizations).csv_data, 'organizations.csv')
    else
      render_permission_error
    end
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
