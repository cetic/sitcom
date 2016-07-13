if Rails.env.development?
  if ENV['USER'] == 'aurels'
    APP_PORT     = 80
    APP_HOSTNAME = "sitcom.dev"
    MAIL_FROM    = 'noreply@sitcom.dev'
  else
    APP_PORT     = 3000
    APP_HOSTNAME = "localhost:#{APP_PORT}"
    MAIL_FROM    = 'noreply@localhost'
  end
end

if Rails.env.production?
  APP_PORT     = 443
  APP_HOSTNAME = 'sitecom.cetic.be'
  MAIL_FROM    = 'noreply@sitecom.cetic.be'
end
