class ApplicationController < ActionController::Base

  # Forgery Protection
  protect_from_forgery with: :exception

  # Filters

  before_action :authenticate_user!
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

  def render_csv(csv_data, filename)
    if request.env['HTTP_USER_AGENT'] =~ /msie/i
      headers['Pragma'] = 'public'
      headers["Content-type"] = "text/csv; charset=utf-8"
      headers['Cache-Control'] = 'no-cache, must-revalidate, post-check=0, pre-check=0'
      headers['Content-Disposition'] = "attachment; filename=\"#{filename}\""
      headers['Expires'] = "0"
    else
      headers["Content-Type"] ||= 'text/csv'
      headers["Content-Disposition"] = "attachment; filename=\"#{filename}\""
    end

    bom     = "\377\376".force_encoding("utf-16le")
    content = bom + csv_data.force_encoding("UTF-8").encode("utf-16le")

    render :text => content
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
