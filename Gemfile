source 'https://rubygems.org'

ruby '2.5.7'

gem 'rails', '5.2.3'
gem 'mysql2'

# Server
gem 'puma', '~> 3.11'

# Authorization
gem 'devise', '4.7.1'

# ElasticSearch
gem 'elasticsearch-model', '0.1.9'
gem 'elasticsearch-rails', '0.1.9'

# Webpacker + React
gem 'webpacker', '~> 4.x'
gem 'react-rails', '1.8.2'

# Assets
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'jquery-rails'
gem 'bootstrap-sass', '3.4.1'
gem 'font-awesome-rails'

# File Attachments
gem 'rmagick'
gem 'carrierwave'

gem 'redis', '~> 3.0'
gem 'sidekiq'

# Utils
gem 'enumerize'
gem 'kaminari'
gem 'factory_girl', '4.7.0'
gem 'faker'
gem 'rabl'
gem 'uuidtools'
gem 'color-generator'
gem 'dotenv-rails'
gem 'roo'
gem 'acts_as_list'
gem 'gibbon'
gem 'bootsnap', '>= 1.1.0', :require => false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

# Deployment
group :development do
  gem 'capistrano', '3.7.2'
  gem 'capistrano-rails'
  gem 'capistrano-rbenv'
  gem 'capistrano-bundler'
  gem 'capistrano-passenger'
  gem 'capistrano-sidekiq'

  gem 'listen', '>= 3.0.5', '< 3.2'
end

group :production do
  gem 'libv8' # Development on OSX: gem install libv8 -v 3.16.14.19 -- --with-system-v8
end
