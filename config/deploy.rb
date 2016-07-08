lock '3.5.0'

set :repo_url,     'git@github.com:aurels/lliw.git'
set :keep_releases, 30

set :use_sudo,  false
set :log_level, :debug
set :pty,       true

set :linked_files, %w{config/database.yml .env.production}
set :linked_dirs,  %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system private/system}

set :rbenv_type, 'user'

set :bundle_binstubs, nil
set :bundle_bins,     %w(gem rake rails)
