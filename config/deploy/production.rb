server ENV['DEPLOY_HOSTNAME'], user: 'deploy', roles: %w{web app db}

set :application,  'lliw'
set :deploy_to,    '/home/deploy/apps/lliw'
set :branch,       'master'
set :rbenv_ruby,   File.read('.ruby-version').strip
