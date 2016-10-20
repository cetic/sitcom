class Api::UsersController < Api::BaseController

  before_action :ensure_admin
  before_action :find_user, :only => [:show, :update, :destroy]

  def index
    @users = User.order(:name)
  end

  def show
  end

  def create
    @user = User.new(strong_params)

    if @user.save
      render 'show'
    else
      render_errors(@user.errors.full_messages)
    end
  end

  def update
    if @user.update_attributes(strong_params)
      render 'show'
    else
      render_errors(@user.errors.messages)
    end
  end

  def destroy
    @user.destroy
    render :nothing => true
  end

  private

  def find_user
    @user = User.find(params[:id])
  end

  def strong_params
    params.fetch(:user, {}).permit(
      :name, :email, :password
    )
  end
end
