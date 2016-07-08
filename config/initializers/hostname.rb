if Rails.env.development?
  if ENV['USER'] == 'aurels'
    APP_PORT     = 80
    APP_HOSTNAME = "lliw.dev"
  else
    APP_PORT     = 3000
    APP_HOSTNAME = "localhost:#{APP_PORT}"
  end
end

if Rails.env.production?
  APP_HOSTNAME = 'FIXME-lliw.be'
end
