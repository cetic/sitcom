set :sidekiq_roles, -> { :app }
set :sidekiq_systemd_unit_name, "sidekiq"

namespace :sidekiq do
  task :quiet do
    on roles fetch(:sidekiq_roles) do
      execute :systemctl, '--user', 'kill', '-s', 'SIGTSTP', 'sidekiq', raise_on_non_zero_exit: false
    end
  end

  task :stop do
    on roles fetch(:sidekiq_roles) do
      execute :systemctl, '--user', 'kill', '-s', 'SIGTERM', 'sidekiq', raise_on_non_zero_exit: false
    end
  end

  task :start do
    on roles fetch(:sidekiq_roles) do
      execute :systemctl, '--user', 'start', 'sidekiq'
    end
  end

  task :restart do
    on roles fetch(:sidekiq_roles) do
      execute :systemctl, '--user', 'restart', 'sidekiq'
    end
  end
end

after 'deploy:starting',  'sidekiq:quiet'
after 'deploy:updated',   'sidekiq:stop'
after 'deploy:published', 'sidekiq:start'
after 'deploy:failed',    'sidekiq:restart'
