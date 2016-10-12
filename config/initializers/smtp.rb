Rails.application.configure do
  if ENV['SMTP_DOMAIN']
    config.action_mailer.smtp_settings = {
      :domain               => ENV['SMTP_DOMAIN'],
      :address              => ENV['SMTP_ADDRESS'],
      :port                 => ENV['SMTP_PORT'].to_i,
      :user_name            => ENV['SMTP_USERNAME'],
      :password             => ENV['SMTP_PASSWORD'],
      :authentication       => 'login',
      :enable_starttls_auto => true
    }
  end

  config.action_mailer.default_url_options = {
    :host => APP_HOSTNAME
  }
end
