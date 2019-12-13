Rails.application.configure do
  if ENV['SMTP_ADDRESS'] && ENV['SMTP_AUTH']
    config.action_mailer.smtp_settings = {
      :domain               => ENV['SMTP_DOMAIN'  ].to_s,
      :address              => ENV['SMTP_ADDRESS' ].to_s,
      :port                 => ENV['SMTP_PORT'    ].to_s,
      :user_name            => ENV['SMTP_USERNAME'].to_s,
      :password             => ENV['SMTP_PASSWORD'].to_s,
      :authentication       => ENV['SMTP_AUTH'].to_sym,
      :enable_starttls_auto => true,
      :ssl                  => ENV["SMTP_SSL"] == 'true',
      :tls                  => ENV["SMTP_TLS"] == 'true'
    }
  end

  config.action_mailer.default_url_options = {
    :host     => APP_HOSTNAME,
    :protocol => (APP_PORT == 443 ? 'https' : 'http')
  }
end
