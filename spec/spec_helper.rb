ENV["RAILS_ENV"] ||= 'test'

require File.expand_path("../../config/environment", __FILE__)

require 'rspec/rails'
require 'capybara/rails'
require 'capybara/rspec'

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }

RSpec.configure do |config|
  config.run_all_when_everything_filtered           = true
  config.use_transactional_fixtures                 = false # because of DatabaseCleaner
  config.infer_base_class_for_anonymous_controllers = false
  config.color                                      = true
  config.order                                      = :random

  config.expect_with :rspec do |c|
    c.syntax = [:should, :expect]
  end

  config.mock_with :rspec do |c|
    c.syntax = [:should, :expect]
  end

end

FactoryGirl.find_definitions
