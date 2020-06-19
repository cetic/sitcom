if Rails.env.development?
  if ENV['USER'] == 'aurels'
    APP_PORT     = 80
    APP_HOSTNAME = "sitcom.test"
    MAIL_FROM    = 'noreply@sitcom.test'
  else
    APP_PORT     = 3000
    APP_HOSTNAME = "localhost:#{APP_PORT}"
    MAIL_FROM    = 'noreply@localhost'
  end
else
  APP_PORT     = 443
  APP_HOSTNAME = ENV['APP_HOSTNAME']
  MAIL_FROM    = ENV['MAIL_FROM']
end
