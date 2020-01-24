FactoryBot.define do
  factory :event do
    association  :lab

    name        { Faker::Hipster.sentence(:word_count => 3, :supplemental => false, :random_words_to_add => 2) }
    happens_on  { Faker::Time.between(:from => DateTime.now - 3.months, :to => DateTime.now + 3.months) }
    place       { Faker::Address.city }
    description { Faker::Lorem.sentence }
    website_url { "http://www.#{name.parameterize}.com" }
  end
end
