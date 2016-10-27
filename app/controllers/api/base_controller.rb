class Api::BaseController < ActionController::Base

  PER_PAGE = 10

  rescue_from 'ActiveRecord::RecordNotFound' do |exception|
    render_errors('Item not found.')
  end

  before_action :find_current_user

  private

  def find_current_user
    @current_user = User.find_by_api_key(params[:api_key])

    unless @current_user
      render_errors(["Invalid or missing API Key."])
    end
  end

  def find_lab
    @lab = @current_user.labs.find(params[:lab_id])
  end

  def render_success(params = {})
    render :json => {
      :success => true
    }.merge(params)
  end

  def render_errors(errors)
    render :json => {
      :success => false,
      :errors  => errors
    }
  end

  def render_permission_error
    render_errors(['Access denied'])
  end

  def ensure_admin
    unless @current_user.admin?
      render_permission_error
    end
  end
end
