class ProjectsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.json do
        projects = ProjectSearch.new(params.merge({
          :lab_id => @lab.id
        })).run

        render :json => {
          :projects => projects
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
        @project = @lab.projects.find(params[:id])
        render :json => @project.as_indexed_json
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @project = @lab.projects.new(strong_params)

        if @project.save
          @project.index_dependent_rows
          render_json_success({ :project => @project.as_indexed_json })
        else
          render_json_errors(@project)
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @project = @lab.projects.find(params[:id])

        if @project.update_attributes(strong_params)
          @project.index_dependent_rows
          render_json_success
        else
          render_json_errors(@project)
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @project = @lab.projects.find(params[:id])

        if @project.destroy_and_index_dependent_rows
          render_json_success
        else
          render_json_errors(@project)
        end
      end
    end
  end

  def options
    @projects = @lab.projects.order(:name)
  end

  private

  # Encapsulate new picture in "project" (don't know how to make it in JS)
  def clean_params
    params[:project] = {}
    params[:project][:picture] = params[:picture]
    params.delete(:picture)
  end

  def strong_params
    params.require(:project).permit(
      :name, :description, :start_date, :end_date,
      :contact_ids => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

end
