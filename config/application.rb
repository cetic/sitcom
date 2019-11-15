require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Sitcom
  class Application < Rails::Application
    config.time_zone              = 'Brussels'
    config.i18n.available_locales = [:fr, :en]
    config.i18n.default_locale    = :fr
  end
end
