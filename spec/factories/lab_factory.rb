FactoryBot.define do
  factory :lab do
    name { Faker::Hipster.sentence(:word_count => 3, :supplemental => false, :random_words_to_add => 2) }
    slug { name.parameterize }
  end
end
