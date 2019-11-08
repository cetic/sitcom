source 'https://rubygems.org'

# Development on OSX :
# gem install libv8 -v 3.16.14.19 -- --with-system-v8
# gem install mysql2 -v '0.5.2' -- --with-cflags=\"-I/usr/local/opt/openssl/include\" --with-ldflags=\"-L/usr/local/opt/openssl/lib\"

gem 'rails',  '~> 5.0.0'
gem 'mysql2', '0.4.10'

# Authorization
gem 'devise'

# ElasticSearch
gem 'elasticsearch-model'
gem 'elasticsearch-rails'

# Assets
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'jquery-rails'
gem 'bootstrap-sass'
gem 'font-awesome-rails'
gem 'lodash-rails'
gem 'react-rails'
gem 'browserify-rails'

# File Attachments
gem 'rmagick'
gem 'carrierwave'

gem 'redis', '~> 3.0'
gem 'sidekiq'

# Utils
gem 'enumerize'
gem 'kaminari'
gem 'factory_girl'
gem 'faker'
gem 'rabl'
gem 'uuidtools'
gem 'color-generator'
gem 'airbrake', '4.1.0'
gem 'dotenv-rails'
gem 'roo'
gem 'acts_as_list'
gem 'puma', '~> 3.0'
gem 'gibbon'

# Deployment
group :development do
  gem 'capistrano'
  gem 'capistrano-rails'
  gem 'capistrano-rbenv'
  gem 'capistrano-bundler'
  gem 'capistrano-passenger'
  gem 'capistrano-sidekiq'

  gem 'listen'
end

group :production do
  # gem 'therubyracer'
  gem 'libv8'
end
