FactoryGirl.define do
  factory :project do
    association  :lab

    name               { Faker::Commerce.product_name }
    description        { Faker::Lorem.sentence }
    start_date         { Faker::Time.between(DateTime.now - 3.months, DateTime.now + 3.months) }
    end_date           { Faker::Time.between(start_date, start_date + 2.weeks) }
    remote_picture_url { Faker::Placeholdit.image }
  end
end
