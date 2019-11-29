set :sidekiq_roles, -> { :app }

SIDEKIQ_SERVICES = ['default', 'websockets']

namespace :sidekiq do
  task :quiet do
    on roles fetch(:sidekiq_roles) do
      SIDEKIQ_SERVICES.each do |type|
        execute :systemctl, '--user', 'kill', '-s', 'SIGTSTP', "sidekiq-#{type}", raise_on_non_zero_exit: false
      end
    end
  end

  task :stop do
    on roles fetch(:sidekiq_roles) do
      SIDEKIQ_SERVICES.each do |type|
        SIDEKIQ_SERVICES.each do |type|
          execute :systemctl, '--user', 'kill', '-s', 'SIGTERM', "sidekiq-#{type}", raise_on_non_zero_exit: false
        end
      end
    end
  end

  task :start do
    on roles fetch(:sidekiq_roles) do
      SIDEKIQ_SERVICES.each do |type|
        execute :systemctl, '--user', 'start', "sidekiq-#{type}"
      end
    end
  end

  task :restart do
    on roles fetch(:sidekiq_roles) do
      SIDEKIQ_SERVICES.each do |type|
        execute :systemctl, '--user', 'restart', "sidekiq-#{type}"
      end
    end
  end
end

after 'deploy:starting',  'sidekiq:quiet'
after 'deploy:updated',   'sidekiq:stop'
after 'deploy:published', 'sidekiq:start'
after 'deploy:failed',    'sidekiq:restart'
