class OrganizationsController < ApplicationController

  include FollowConcern

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.html do
        render './shared/routes'
      end

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
    end
  end

  def show
    respond_to do |format|
      format.html do
        render './shared/routes'
      end

      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('organizations')
          @organization = @lab.organizations.find(params[:id])
          render :json => BaseSearch.reject_private_notes_from_result(
                            BaseSearch.reject_private_documents_from_result(
                              @organization.as_indexed_json
                            )
                          )
        else
          render_permission_error
        end
      end
    end
  end

  def create
    if PermissionsService.new(current_user, @lab).can_write?('organizations')
      respond_to do |format|
        format.json do
          @organization = @lab.organizations.new(strong_params)

          if @organization.save
            LogEntry.log_create(current_user, @organization)

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
          @organization            = @lab.organizations.find(params[:id])
          previous_association_ids = @organization.association_ids

          if @organization.update(strong_params)
            LogEntry.log_update(current_user, @organization, previous_association_ids)

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
          @organization            = @lab.organizations.find(params[:id])
          previous_association_ids = @organization.association_ids

          if @organization.destroy
            LogEntry.log_destroy(current_user, @organization, previous_association_ids)

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

  def mass_destroy
    if PermissionsService.new(current_user, @lab).can_write?('organizations')
      respond_to do |format|
        format.json do
          MassDestroyService.new(current_user, 'Organization', params[:ids]).destroy

          render_json_success
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

      render_xlsx(OrganizationExport.new(@lab, organizations).xlsx_data, 'organizations.xlsx')
    else
      render_permission_error
    end
  end

  private

  # Encapsulate new picture in "organization" (don't know how to make it in JS)
  def clean_params
    if params[:picture]
      params[:organization] ||= {}

      params[:organization][:picture] = params[:picture]
      params.delete(:picture)
    end
  end

  def strong_params
    params.require(:organization).permit(
      :name, :status, :description, :website_url,
      :picture,
      :contact_ids => [],
      :event_ids   => [],
      :project_ids => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
