ENV['RAILS_ENV'] ||= 'test'

require File.expand_path('../config/environment', __dir__)

require 'rspec/rails'
require 'rspec/retry'
require 'capybara/rails'
require 'capybara/rspec'
require "selenium/webdriver"
require 'sidekiq/testing'
require "zonebie/rspec"

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].each { |f| require f }

# Checks for pending migrations and applies them before tests are run.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  puts e.to_s.strip
  exit 1
end

RSpec.configure do |config|
  config.filter_rails_from_backtrace!       # Filter lines from Rails gems in backtraces.
  config.use_transactional_fixtures = false # Because of DatabaseCleaner
  config.order = :random

  # Includes

  config.include PutsHelpers
  config.include ScreenshotHelpers
  config.include Rails.application.routes.url_helpers
  config.include Capybara::DSL
  config.include EmailSpec::Helpers
  config.include EmailSpec::Matchers
  #config.include Devise::Test::ControllerHelpers, :type => :controller # (1) https://github.com/plataformatec/devise/wiki/How-To:-Test-controllers-with-Rails-3-and-4-%28and-RSpec%29
  config.include Warden::Test::Helpers                                 # (2) https://github.com/plataformatec/devise/wiki/How-To:-Test-with-Capybara

  # rspec < 3 compatibility

  config.expect_with :rspec do |c|
    c.syntax = [:should, :expect]
  end

  config.mock_with :rspec do |c|
    c.syntax = [:should, :expect]
  end

  # Sidekiq direct execution of jobs

  Sidekiq::Testing.inline!

  # Configure browsers

  Capybara.server     = :puma, { Silent: true }
  Capybara.asset_host = 'http://localhost:3000' # to make html screenshot with visible assets

  Capybara.register_driver :selenium_chrome_headless_with_resolution_and_js_logs do |app|
    Capybara::Selenium::Driver.load_selenium
    browser_options = ::Selenium::WebDriver::Chrome::Options.new
    browser_options.args << '--headless'
    browser_options.args << '--disable-gpu' if Gem.win_platform?
    browser_options.args << '--window-size=1440,900'          # Useful for screenshots but slower!
    browser_options.args << '--disable-site-isolation-trials' # Workaround https://bugs.chromium.org/p/chromedriver/issues/detail?id=2650&q=load&sort=-id&colspec=ID%20Status%20Pri%20Owner%20Summary

    # https://gist.github.com/bbonamin/4b01be9ed5dd1bdaf909462ff4fdca95

    download_path = DownloadHelpers::PATH
    FileUtils.mkdir_p(download_path)

    browser_options.add_preference(:download,
      prompt_for_download: false,
      default_directory:   download_path
    )

    browser_options.add_preference(:browser, set_download_behavior: { behavior: 'allow' })

    driver = Capybara::Selenium::Driver.new(app, {
      :browser              => :chrome,
      :options              => browser_options,
      :desired_capabilities => Selenium::WebDriver::Remote::Capabilities.chrome(
        :loggingPrefs => {
          :browser => 'ALL'
        }
      )
    })

    ### Allow file downloads in Google Chrome when headless!!!
    ### https://bugs.chromium.org/p/chromium/issues/detail?id=696481#c89
    bridge = driver.browser.send(:bridge)

    path = '/session/:session_id/chromium/send_command'
    path[':session_id'] = bridge.session_id

    bridge.http.call(:post, path, cmd: 'Page.setDownloadBehavior',
                                  params: {
                                    behavior:     'allow',
                                    downloadPath: download_path
                                  })
    ###

    driver
  end

  Capybara.register_driver :selenium_firefox_headless do |app|
    browser_options = Selenium::WebDriver::Firefox::Options.new
    browser_options.args << '--headless'
    browser_options.profile = Selenium::WebDriver::Firefox::Profile.new

    browser_client = Selenium::WebDriver::Remote::Http::Default.new
    browser_client.read_timeout = 90 # instead of the default 60 => https://github.com/teamcapybara/capybara/issues/1305

    Capybara::Selenium::Driver.new(app, {
      :browser     => :firefox,
      :http_client => browser_client,
      :options     => browser_options
    })
  end

  if ENV['BROWSER'] == 'firefox'
    Capybara.javascript_driver = :selenium_firefox_headless
  elsif ENV['BROWSER'] == 'chrome_visual'
    Capybara.javascript_driver = :selenium_chrome
  elsif ENV['BROWSER'] == 'chrome_debug'
    Capybara.javascript_driver = :selenium_chrome_headless_with_resolution_and_js_logs
  else
    Capybara.javascript_driver = :selenium_chrome_headless # available drivers: :rack_test, :selenium, :selenium_chrome, :selenium_chrome_headless, :webkit, :webkit_debug
  end

  Capybara.default_driver = :rack_test

  # Time between auto-updates of drivers (Chrome/Firefox etc.)
  Webdrivers.cache_time = 1.day.to_i

  # Rspec retry (only on CI)
  if ENV['ONCI']
    config.verbose_retry                = true # show retry status in spec process
    config.display_try_failure_messages = true # show exception that triggers a retry if verbose_retry is set to true
    config.default_retry_count          = 2
  end

  # Before actions

  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation, :except => ['ar_internal_metadata'])

    Webpacker.compile

    # If error cluster_block_exception because low disk-space, need to unlock: https://stackoverflow.com/a/48055605/1243212
    # system("curl -s -X PUT \"localhost:9200/translation-#{Rails.env}-#{ENV['TEST_ENV_NUMBER']}-segments/_settings\" -H 'Content-Type: application/json' -d '{ \"index.blocks.read_only_allow_delete\": null }' > /dev/null")
  end

  # Default DatabaseCleaner strategy
  config.before :each do
    DatabaseCleaner.strategy = :transaction # revert transactions, but doesn't work for JS specs
  end

  # Default DatabaseCleaner strategy for :js specs
  config.before :each, :js => :true do
    Capybara.current_session.current_window.resize_to(1280, 800)
    DatabaseCleaner.strategy = :deletion
  end

  config.before :each do
    DatabaseCleaner.start

    [Contact, Organization, Project, Event].each do |klass|
      klass.__elasticsearch__.create_index!(:force => true)
    end
  end

  # config.before :each, :type => :controller do # (cf. 1)
  #   @request.env["devise.mapping"] = Devise.mappings[:user]
  #   user = FactoryBot.create(:user)
  #   sign_in user
  # end

  # After actions

  config.after :each do |x|
    puts
    print cyan("== %6.2f" % (Time.now - x.execution_result.started_at))
    print cyan(" - #{x.metadata[:full_description].to_s.gsub("\n", "").gsub("        ", "")}.")
    print cyan(" => ") # final dot
  end

  config.append_after(:each) do |x|
    DatabaseCleaner.clean
    #Warden.test_reset! # (cf. 2)
  end

  config.before :each, :download_file => true do
    Capybara.current_driver = :selenium_chrome_headless_with_resolution_and_js_logs
  end

  config.after :each, :download_file => true do
    Capybara.use_default_driver
  end

  # Prints js errors in console
  config.after(:each, :js => true) do
    if Capybara.javascript_driver != :selenium && Capybara.javascript_driver != :selenium_firefox_headless # doesn't work with firefox
      begin
        errors = page.driver.browser.manage.logs.get(:browser)
        if errors.present?
          aggregate_failures 'javascript errors' do
            errors.each do |error|
              if !error.message.include?('Download the React DevTools')
                print "\n" + red_with_gray_bg(error.message)
              end
            end
          end
        end
      rescue => e
        print "\nError writing JS logs: #{e.message}"
      end
    end
  end
end

FactoryBot.find_definitions
