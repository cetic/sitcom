FactoryBot.define do
  factory :lab do
    name { Faker::Hipster.sentence(:word_count => 2, :supplemental => false, :random_words_to_add => 1) }
    slug { name.parameterize }
  end
end
