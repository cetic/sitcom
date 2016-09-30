lock '3.5.0'

set :repo_url,     'git@github.com:aurels/sitcom.git'
set :keep_releases, 30

set :use_sudo,  false
set :log_level, :debug
set :pty,       false

set :linked_files, %w{.env.production}
set :linked_dirs,  %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system private/system misc/private}

set :rbenv_type, 'user'

set :bundle_binstubs, nil
set :bundle_bins,     %w(gem rake rails sidekiq)

before 'deploy:assets:precompile', 'deploy:npm:install'

namespace :deploy do
  namespace :npm do
    task :install do
      stage = fetch(:stage).to_s

      on roles(:app) do
        execute "cd #{release_path} && #{fetch(:rbenv_prefix)} bundle exec rake npm:install RAILS_ENV=#{stage}"
      end
    end
  end
end
