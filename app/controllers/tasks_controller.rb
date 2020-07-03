class TasksController < ApplicationController

  before_action :find_lab
  before_action :find_item
  before_action :find_item_type
  before_action :find_task,         only: [ :update, :destroy ]
  before_action :check_permissions, only: [ :update, :destroy ]

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?(@item_type)
          @tasks = @item.tasks

          render :json => @tasks.map(&:as_indexed_json)
        else
          render_permission_error
        end
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @task      = @item.tasks.new(strong_params)
        @task.user = current_user

        if PermissionsService.new(current_user, @lab).can_write?(@item_type)
          if @task.save
            #LogEntry.log_create_task(current_user, @task)

            render_json_success
          else
            render_json_errors(@task)
          end
        else
          render_permission_error
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        if @task.update(strong_params)
          #LogEntry.log_update_task(current_user, @task)

          render_json_success
        else
          render_json_errors(@task)
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        if @task.destroy
          #LogEntry.log_destroy_task(current_user, @task)

          render_json_success
        else
          render_json_errors(@task)
        end
      end
    end
  end

  def toggle
    respond_to do |format|
      format.json do
        if @task.toggle
          render_json_success
        else
          render_json_errors(@task)
        end
      end
    end
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

  def find_item
    [:contact, :organization, :event, :project].each do |item_type|
      item_id = params["#{item_type}_id".to_sym]

      if item_id
        @item = @lab.send(item_type.to_s.pluralize.to_sym).find(item_id)
      end
    end
  end

  def find_item_type
    @item_type = @item.class.name.pluralize.underscore
  end

  def find_task
    @task = @item.tasks.find(params[:id])
  end

  def check_permissions
    unless PermissionsService.new(current_user, @lab).can_write?(@item_type)
      render_permission_error
    end
  end

  def strong_params
    params.require(:task).permit(
      :user_id, :name, :text, :execution_date, :done_at
    )
  end
end
