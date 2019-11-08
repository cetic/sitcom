lock '3.7.2'

set :repo_url,      'git@github.com:cetic/sitcom.git'
set :keep_releases, 30

set :application, 'sitcom'
set :rbenv_ruby,  '2.3.1' # File.read('.ruby-version').strip

set :use_sudo,  false
set :log_level, :debug
set :pty,       false

set :linked_files, %w{.env}
set :linked_dirs,  %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system private/system misc/private}

set :rbenv_type, 'user'

set :bundle_binstubs, nil
set :bundle_bins,     %w(gem rake rails sidekiq sidekiqctl)

set :sidekiq_processes,           2
set :sidekiq_options_per_process, ["--concurrency 2 --queue websockets", "--concurrency 1 --queue default"]

before 'deploy:assets:precompile', 'deploy:npm:install'
