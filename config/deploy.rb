lock '3.5.0'

set :repo_url,     'git@github.com:aurels/sitcom.git'
set :keep_releases, 30

set :use_sudo,  false
set :log_level, :debug
set :pty,       true

set :linked_files, %w{.env.production}
set :linked_dirs,  %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system private/system}

set :rbenv_type, 'user'

set :bundle_binstubs, nil
set :bundle_bins,     %w(gem rake rails)


namespace :deploy do
  task :start, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && bundle exec passenger start -e #{fetch(:stage)} -p 8080 -d"
  end

  task :stop, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && bundle exec passenger stop -p 8080"
  end

  task :restart, :roles => :app, :except => { :no_release => true } do
    run <<-CMD
      if [[ -f #{current_path}/tmp/pids/passenger.8080.pid ]];
      then
        cd #{current_path} && bundle exec passenger stop -p 8080;
      fi
    CMD

    run "cd #{current_path} && bundle exec passenger start -e #{fetch(:stage)} -p 8080 -d"
  end
end
