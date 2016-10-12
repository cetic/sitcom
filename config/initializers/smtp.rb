Rails.application.configure do
  if ENV['SMTP_ADDRESS']
    config.action_mailer.smtp_settings = {
      :domain               => ENV['SMTP_DOMAIN'  ],
      :address              => ENV['SMTP_ADDRESS' ],
      :port                 => ENV['SMTP_PORT'    ],
      :user_name            => ENV['SMTP_USERNAME'],
      :password             => ENV['SMTP_PASSWORD'],
      :authentication       => :login,
      :enable_starttls_auto => true,
      :ssl                  => true,
      :tls                  => true
    }
  end

  config.action_mailer.default_url_options = {
    :host => APP_HOSTNAME
  }
end
