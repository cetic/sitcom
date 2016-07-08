Rails.application.configure do
  if Rails.env.development?
    config.action_mailer.smtp_settings = {
      :domain  => 'localhost',
      :address => 'localhost',
      :port    => 1025,
    }
  end

  config.action_mailer.default_url_options = {
    :host => APP_HOSTNAME
  }
end
