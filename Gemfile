source 'https://rubygems.org'

ruby '2.6.5'

gem 'devise', '4.7.1'
gem 'mysql2', '0.5.2'
gem 'puma',   '4.3.9'
gem 'rack',   '2.1.4'
gem 'rails',  '6.0.3.7'

# ElasticSearch
gem 'elasticsearch-model', '7.0.0'
gem 'elasticsearch-rails', '7.0.0'

# Webpacker + React
gem 'webpacker', '~> 4.x'
gem 'react-rails'

# Assets
gem 'sass-rails'
gem 'uglifier', '>= 1.3.0'
gem 'jquery-rails'
gem 'bootstrap-sass'
gem 'font-awesome-rails'

# File Attachments
gem 'rmagick'
gem 'carrierwave', '2.1.1'

# Jobs
gem 'redis'
gem 'sidekiq'

# Utils
gem 'acts_as_list'
gem 'color-generator'
gem 'dotenv-rails'
gem 'enumerize'
gem 'factory_bot'
gem 'faker'
gem 'gibbon'
gem 'kaminari'
gem 'rabl'
gem 'rubyXL', '3.4.9'
gem 'uuidtools'
gem 'bugsnag'
gem 'active_attr'

gem 'bootsnap', '>= 1.1.0', :require => false

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

# Deployment
group :development do
  gem 'capistrano', '3.11.2'
  gem 'capistrano-rails'
  gem 'capistrano-rbenv'
  gem 'capistrano-bundler'
  gem 'capistrano-passenger'

  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'rubocop'
end

group :development, :test do
  gem 'rspec-rails'
  gem 'rspec-retry'
  gem 'parallel_tests'
  gem 'database_cleaner'
  gem 'capybara'
  gem 'webdrivers'
  gem 'email_spec'
  gem 'zonebie'
end

group :production do
  gem 'libv8' # Development on OSX: gem install libv8 -v 3.16.14.19 -- --with-system-v8
end
