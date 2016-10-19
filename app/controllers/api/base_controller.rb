class Api::BaseController < ActionController::Base
  before_action :find_user

  private

  def find_user
    @user = User.find_by_api_key(params[:api_key])

    unless @user
      render_errors(["Invalid or missing API Key."])
    end
  end

  def find_lab
    @lab = @user.labs.find(params[:lab_id])
  end

  def render_errors(errors)
    render :json => {
      :errors => errors
    }
  end

  def render_permission_error
    render_errors(['Access denied'])
  end
end
