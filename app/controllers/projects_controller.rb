class ProjectsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.html do
        render './shared/routes'
      end

      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('projects')
          projects = ProjectSearch.new(current_user, params.merge({
            :lab_id => @lab.id
          })).run

          if params[:only_ids]
            render :json => {
              :project_ids => projects
            }
          else
            render :json => {
              :projects => projects
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
        if PermissionsService.new(current_user, @lab).can_read?('projects')
          @project = @lab.projects.find(params[:id])
          render :json => BaseSearch.reject_private_notes_from_result(
                            BaseSearch.reject_private_documents_from_result(
                              @project.as_indexed_json
                            )
                          )
        else
          render_permission_error
        end
      end
    end
  end

  def create
    if PermissionsService.new(current_user, @lab).can_write?('projects')
      respond_to do |format|
        format.json do
          if LabAccountTypeService.new(@lab).can_create_project?
            @project = @lab.projects.new(strong_params)

            if @project.save
              LogEntry.log_create(current_user, @project)

              render_json_success({ :project_id => @project.id })
            else
              render_json_errors(@project)
            end
          else
            render :json => { :success => false, :quota_reached => true }
          end
        end
      end
    else
      render_permission_error
    end
  end

  def update
    if PermissionsService.new(current_user, @lab).can_write?('projects')
      respond_to do |format|
        format.json do
          @project                 = @lab.projects.find(params[:id])
          previous_association_ids = @project.association_ids

          if @project.update(strong_params)
            LogEntry.log_update(current_user, @project, previous_association_ids)

            render_json_success
          else
            render_json_errors(@project)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def destroy
    if PermissionsService.new(current_user, @lab).can_write?('projects')
      respond_to do |format|
        format.json do
          @project                 = @lab.projects.find(params[:id])
          previous_association_ids = @project.association_ids

          if @project.destroy
            LogEntry.log_destroy(current_user, @project, previous_association_ids)

            render_json_success
          else
            render_json_errors(@project)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def mass_destroy
    if PermissionsService.new(current_user, @lab).can_write?('projects')
      respond_to do |format|
        format.json do
          MassDestroyService.new(current_user, 'Project', params[:ids]).destroy

          render_json_success
        end
      end
    else
      render_permission_error
    end
  end

  def options
    @projects = @lab.projects.order(:name)
  end

  def export
    if PermissionsService.new(current_user, @lab).can_read?('projects')
      projects = ProjectSearch.new(current_user, params.merge({
        :lab_id => @lab.id
      })).run

      render_xlsx(ProjectExport.new(@lab, projects).xlsx_data, 'projects.xlsx')
    else
      render_permission_error
    end
  end

  private

  # Encapsulate new picture in "project" (don't know how to make it in JS)
  def clean_params
    if params[:picture]
      params[:project] ||= {}

      params[:project][:picture] = params[:picture]
      params.delete(:picture)
    end
  end

  def strong_params
    params.require(:project).permit(
      :name, :description, :start_date, :end_date,
      :picture,
      :contact_ids      => [],
      :organization_ids => [],
      :event_ids        => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

end
