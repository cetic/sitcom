class Admin::ApiKeysController < Admin::BaseController
  before_action :find_user

  def show
  end

  def reset
    @user.set_new_api_key
    @user.save!
    redirect_to admin_user_api_key_path(@user)
  end

  protected

  def find_user
    @user = User.find(params[:user_id])
  end
end
