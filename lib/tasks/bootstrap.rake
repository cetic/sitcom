namespace :app do
  task :bootstrap => :environment do
    if Rails.env.production?
      puts "Cannot use this task in production/staging"
    else

    end
  end
end
