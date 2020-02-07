BUGSNAG_API_KEY = '9731783e2ea10c1b5be62716ff0c57b6'

Bugsnag.configure do |config|
  config.api_key               = BUGSNAG_API_KEY
  config.notify_release_stages = ['production', 'staging']
  config.send_environment      = true
end
