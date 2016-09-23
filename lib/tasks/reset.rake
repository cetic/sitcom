namespace :app do
  task :reset => :environment do
    system("RAILS_ENV=development  bundle exec rails db:environment:set")
    system("RAILS_ENV=#{Rails.env} bundle exec rails db:migrate:reset")
    system("RAILS_ENV=#{Rails.env} bundle exec rails db:seed")
    system("RAILS_ENV=#{Rails.env} bundle exec rake app:bootstrap")
    system("RAILS_ENV=#{Rails.env} bundle exec rake app:bootstrap_fake")
    system("RAILS_ENV=#{Rails.env} bundle exec rake environment elasticsearch:import:all FORCE=true")
  end
end
