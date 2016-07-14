namespace :app do
  task :reset => :environment do
    system("RAILS_ENV=#{Rails.env} bundle exec rails db:migrate:reset")
    system("RAILS_ENV=#{Rails.env} bundle exec rails db:seed")
    system("RAILS_ENV=#{Rails.env} bundle exec rake app:bootstrap")
  end
end
