namespace :passenger do
  namespace :standalone do
    task :start do
      on roles(:app) do
        within release_path do
          execute "passenger start --port 8080  --pid-file /home/deploy/passenger.pid -d"
        end
      end
    end

    task :stop do
      on roles(:app) do
        within release_path do
          execute "passenger stop --port 8080  --pid-file /home/deploy/passenger.pid"
        end
      end
    end

    task :restart do
      on roles(:app) do
        within release_path do
          execute "passenger stop  --port 8080 --pid-file /home/deploy/passenger.pid --ignore-pid-not-found"
          execute "passenger start --port 8080 --pid-file /home/deploy/passenger.pid  -d"
        end
      end
    end
  end
end
