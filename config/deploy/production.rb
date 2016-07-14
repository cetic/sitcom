require 'dotenv'
Dotenv.load('.env.development')

server ENV['DEPLOY_HOSTNAME'], port:  ENV['DEPLOY_SSH_PORT'],
                               user:  ENV['DEPLOY_SSH_USER'],
                               roles: %w{web app db}

set :application,  'sitcom'
set :deploy_to,    "/home/#{ENV['DEPLOY_SSH_USER']}/apps/sitcom"
set :branch,       'master'
set :rbenv_ruby,   File.read('.ruby-version').strip
