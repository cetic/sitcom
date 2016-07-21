class ApplicationController < ActionController::Base

  # Forgery Protection
  protect_from_forgery with: :exception

  # Filters

  before_action :authenticate_user!
  #before_action :http_basic_auth

  # Actions

  def root
    redirect_to "/#{Lab.first.slug}"
  end

  # Methods

  protected

  def render_404
    raise ActionController::RoutingError.new('Not Found')
  end

  def set_flash_now_errors(object)
    if object.errors.any?
      flash.now[:alert] = object.errors.messages.values.join('<br />').html_safe
    end
  end

  def find_lab
    @lab = Lab.find_by_slug(params[:lab_slug])
  end

  def http_basic_auth
    if Rails.env.production? && ENV['HTTP_BASIC_AUTH_USERNAME'].present?
      authenticate_or_request_with_http_basic do |username, password|
        username == ENV['HTTP_BASIC_AUTH_USERNAME'] &&
        password == ENV['HTTP_BASIC_AUTH_PASSWORD']
      end
    end
  end

  # Devise hooks

  def after_sign_in_path_for(resource)
    main_root_path
  end

  def after_sign_out_path_for(resource)
    main_root_path
  end

end
