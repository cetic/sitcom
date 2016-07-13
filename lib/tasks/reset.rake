namespace :app do
  task :reset => :environment do
    if Rails.env.production?
      puts "Cannot use this task in production/staging"
    else
      system("RAILS_ENV=#{Rails.env} bundle exec rails db:migrate:reset")
      system("RAILS_ENV=#{Rails.env} bundle exec rails db:seed")
      system("RAILS_ENV=#{Rails.env} bundle exec rake app:bootstrap")
    end
  end
end
