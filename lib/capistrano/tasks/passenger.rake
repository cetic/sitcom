namespace :deploy do
  # task :start do
  #   on roles(:app) do
  #     within release_path do
  #       execute "passenger start -e #{fetch(:stage)} -p 8080 -d"
  #     end
  #   end
  # end

  # task :start do
  #   on roles(:app) do
  #     within release_path do
  #       execute "passenger stop -e #{fetch(:stage)} -p 8080"
  #     end
  #   end
  # end

  task :restart do
    on roles(:app) do
      within release_path do
        # execute "passenger stop  -e #{fetch(:stage)} -p 8080"
        # execute "passenger start -e #{fetch(:stage)} -p 8080 -d"

        execute :bundle, :exec, :'bin/passenger', :start, :'-p', :'8080'
        execute :bundle, :exec, :'bin/passenger', :stop,  :'-p', :'8080', :'-d'
      end
    end
  end
end
