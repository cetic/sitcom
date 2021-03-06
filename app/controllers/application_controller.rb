class ApplicationController < ActionController::Base

  # Forgery Protection
  protect_from_forgery with: :exception

  # Filters

  before_action :authenticate_user!
  after_action :update_last_seen_at
  #before_action :http_basic_auth

  # Actions

  # Methods

  protected

  def find_lab_from_cookies
    if cookies.permanent.signed[:current_lab_id]
      @lab = current_user.labs.where(:id => cookies.permanent.signed[:current_lab_id]).first

      if !@lab
        @lab = current_user.labs.first
      end
    end
  end

  def save_lab_in_cookies(lab)
    cookies.permanent.signed[:current_lab_id] = lab.id
  end

  def render_404
    raise ActionController::RoutingError.new('Not Found')
  end

  def set_flash_now_errors(object)
    if object.errors.any?
      flash.now[:alert] = object.errors.messages.values.join('<br />').html_safe
    end
  end

  def update_last_seen_at
    if current_user
      current_user.update_column(:last_seen_at, Time.now)

      if @lab
        lab_user_link = @lab.lab_user_links.where(:user_id => current_user.id).first

        if lab_user_link.try(:last_seen_at) && lab_user_link.last_seen_at < 30.minutes.ago
          @lab.increase_lab_visits
        end

        if lab_user_link
          lab_user_link.update_column(:last_seen_at, Time.now)
        end
      end
    end
  end

  def render_json_success(params = {})
    render :json => {
      :success => true
    }.merge(params)
  end

  def render_json_errors(object)
    render :json => {
      :success => false,
      :errors  => object.errors.messages.values
    }
  end

  def render_permission_error
    respond_to do |format|
      format.html do
        render :text => 'permission error'
      end

      format.json do
        render :json => {
          :success => false,
          :errors  => ['permission error']
        }
      end
    end
  end

  def render_xlsx(data, filename)
    # send_data(data, :disposition => :attachment, :filename => filename)
    send_data(data, :disposition => :inline, :filename => filename)
  end

  def admin_page?
    params[:controller].split('/').first == 'admin'
  end

  def http_basic_auth
    if ENV['HTTP_BASIC_AUTH_USERNAME'].present?
      authenticate_or_request_with_http_basic do |username, password|
        username == ENV['HTTP_BASIC_AUTH_USERNAME'] &&
        password == ENV['HTTP_BASIC_AUTH_PASSWORD']
      end
    end
  end

end
