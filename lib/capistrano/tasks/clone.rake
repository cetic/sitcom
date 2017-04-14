# bundle exec cap cetic clone_to_development
# bundle exec cap production clone_to_development

task :clone_to_development do
  env_name = fetch(:stage).to_s

  # Database

  env_data       = Dotenv::Environment.new(File.new(".env.#{env_name}"))
  env_mysql_uri  = URI.parse(env_data['DATABASE_URL'])

  env_mysql_username = env_mysql_uri.user
  env_mysql_password = env_mysql_uri.password
  env_mysql_database = env_mysql_uri.path.split('/').last

  on roles(:db) do
    execute "mysqldump -u \"#{env_mysql_username}\" -p\"#{env_mysql_password}\" \"#{env_mysql_database}\" > /home/deploy/#{env_name}.sql"
    download! "/home/deploy/#{env_name}.sql", "tmp/#{env_name}.sql"
  end

  run_locally do
    dev_env_data      = Dotenv::Environment.new(File.new(".env.development"))
    dev_env_mysql_uri = URI.parse(dev_env_data['DATABASE_URL'])

    dev_env_mysql_username = dev_env_mysql_uri.user
    dev_env_mysql_password = dev_env_mysql_uri.password
    dev_env_mysql_database = dev_env_mysql_uri.path.split('/').last

    passwd_option = dev_env_mysql_password.nil? ? '' : "-p#{dev_env_mysql_password}"

    execute "bundle exec rake db:drop"
    execute "bundle exec rake db:create"
    execute "mysql -u #{dev_env_mysql_username} #{passwd_option} #{dev_env_mysql_database} < tmp/#{env_name}.sql"
    execute "bundle exec rake db:environment:set RAILS_ENV=development"
    execute "bundle exec rake db:migrate"
    execute "bundle exec rake environment elasticsearch:import:all FORCE=true"
  end

  # # public/system and private/system

  # ['public', 'private'].each do |privacy|
  #   on roles(:app) do
  #     archive_name = "#{privacy}-system-#{env_name}.tar.bz2"
  #     execute "cd #{deploy_to}/shared/#{privacy} && tar -jcf #{archive_name} system"
  #     download! "#{deploy_to}/shared/#{privacy}/#{archive_name}",  "#{privacy}/#{privacy}-system.tar.bz2"
  #   end

  #   run_locally do
  #     execute "cd #{privacy} && tar -jxf #{privacy}-system.tar.bz2"
  #     execute "rm #{privacy}/#{privacy}-system.tar.bz2"
  #   end
  # end

end
