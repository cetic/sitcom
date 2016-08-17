FactoryGirl.define do
  factory :organization do
    association  :lab

    name        { Faker::Company.name }
    status      { Faker::Company.suffix }
    description { Faker::Lorem.sentence }
    website_url { "http://www.#{name}.com" }
  end
end

