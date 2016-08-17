FactoryGirl.define do
  factory :event do
    association  :lab

    name        { Faker::Hipster.sentence(3, false, 2) }
    happens_on  { Faker::Time.between(DateTime.now - 3.months, DateTime.now + 3.months) }
    place       { Faker::Address.city }
    description { Faker::Lorem.sentence }
    website_url { "http://www.#{name}.com" }
    picture     { Faker::Placeholdit.image }
  end
end
