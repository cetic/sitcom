FactoryBot.define do
  factory :project do
    association  :lab

    name        { Faker::Commerce.product_name }
    description { Faker::Lorem.sentence }
    start_date  { Faker::Time.between(:from => DateTime.now - 3.months, :to => DateTime.now + 3.months) }
    end_date    { Faker::Time.between(:from => start_date,              :to => start_date + 2.weeks) }
  end
end
