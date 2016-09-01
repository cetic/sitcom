FactoryGirl.define do
  factory :organization do
    association  :lab

    name        { Faker::Company.name }
    status      { Faker::Company.suffix }
    description { Faker::Lorem.sentence }
    website_url { "http://www.#{name}.com" }
    remote_picture_url { Faker::Placeholdit.image }
  end
end

