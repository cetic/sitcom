if ENV['AIRBRAKE_KEY']
  Airbrake.configure do |config|
    config.api_key = ENV['AIRBRAKE_KEY']
    config.secure  = false
    config.host    = 'errors.phonoid.com'
    config.port    = 80
  end
end
