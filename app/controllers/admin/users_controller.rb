class Admin::UsersController < Admin::BaseController
  before_action :find_user,           :only => [ :edit, :update, :destroy ]
  before_action :find_available_labs, :only => [ :new, :create, :edit, :update ]

  def index
    if current_user.lab_manager?
      user_ids = current_user.labs.map(&:user_ids).flatten.uniq

      @users = User.where(id: user_ids).order(:name)
    else
      @users = User.order(:name)
    end
  end

  def new
    @user = User.new
    render 'form'
  end

  def create
    @user = User.new(strong_params)

    if @user.save
      redirect_to admin_users_path
    else
      raise @user.errors.inspect
      set_flash_now_errors(@user)
      render 'form'
    end
  end

  def edit
    render 'form'
  end

  def update
    if params[:user][:password].present?
      updated = @user.update(strong_params)
    else
      updated = @user.update_without_password(strong_params)
    end

    if updated
      redirect_to admin_users_path
    else
      set_flash_now_errors(@user)
      render 'form'
    end
  end

  def destroy
    saved_task_ids = @user.task_ids
    @user.destroy

    Task.where(:id => saved_task_ids).each do |task|
      "Reindex#{task.item_type}Worker".constantize.perform_async(task.item_id)
      task.item.cable_update
    end

    redirect_to admin_users_path
  end

  protected

  def find_user
    if current_user.lab_manager?
      user_ids = current_user.labs.map(&:user_ids).flatten.uniq

      @user = User.where(id: user_ids).find(params[:id])
    else
      @user = User.find(params[:id])
    end
  end

  def find_available_labs
    if current_user.lab_manager?
      @available_labs = current_user.labs.order(:name)
    else
      @available_labs = Lab.order(:name)
    end
  end

  private

  def strong_params
    params[:user][:lab_ids] ||= []

    if current_user.lab_manager?
      available_lab_ids = @available_labs.pluck(:id).map(&:to_s)
      params[:user][:lab_ids] = params[:user][:lab_ids].select do |lab_id|
        available_lab_ids.include?(lab_id)
      end
    end

    if current_user.admin?
      params.require(:user).permit(
        :name, :email, :password, :password_confirmation, :admin, :lab_manager, :lab_ids => []
      )
    else
      params.require(:user).permit(
        :name, :email, :password, :password_confirmation, :lab_ids => []
      )
    end
  end
end
