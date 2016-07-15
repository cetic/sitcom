class Admin::UsersController < Admin::BaseController
  before_action :find_user,        :only => [ :edit, :update, :destroy ]

  def index
    @users = User.order(:name)
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
      set_flash_now_errors(@user)
      render 'form'
    end
  end

  def edit
    render 'form'
  end

  def update
    if @user.update_attributes(strong_params)
      redirect_to admin_users_path
    else
      set_flash_now_errors(@user)
      render 'form'
    end
  end

  def destroy
    @user.destroy
    redirect_to admin_users_path
  end

  protected

  def find_user
    @user = User.find(params[:id])
  end

  private

  def strong_params
    if params[:action] == 'create'
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    else
      params.require(:user).permit(:name, :email)
    end
  end
end
