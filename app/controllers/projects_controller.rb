class ProjectsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('projects')
          projects = ProjectSearch.new(params.merge({
            :lab_id => @lab.id
          })).run

          render :json => {
            :projects => projects
          }
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
        if PermissionsService.new(current_user, @lab).can_read?('projects')
          @project = @lab.projects.find(params[:id])
          render :json => @project.as_indexed_json
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
    if PermissionsService.new(current_user, @lab).can_write?('projects')
      respond_to do |format|
        format.json do
          @project = @lab.projects.new(strong_params)

          if @project.save
            render_json_success({ :project => @project.as_indexed_json })
          else
            render_json_errors(@project)
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
          @project = @lab.projects.find(params[:id])

          if @project.update_attributes(strong_params)
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
          @project = @lab.projects.find(params[:id])

          if @project.destroy
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

  def options
    @projects = @lab.projects.order(:name)
  end

  private

  # Encapsulate new picture in "project" (don't know how to make it in JS)
  def clean_params
    params[:project] ||= {}
    params[:project][:picture] = params[:picture]
    params.delete(:picture)
  end

  def strong_params
    params.require(:project).permit(
      :name, :description, :start_date, :end_date,
      :picture,
      :contact_ids => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

end
