Bugsnag.configure do |config|
  config.api_key               = ENV['BUGSNAG_API_KEY']
  config.notify_release_stages = ['production', 'staging']
  config.send_environment      = true
end
