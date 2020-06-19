FactoryBot.define do
  factory :lab do
    name         { Faker::Hipster.sentence(:word_count => 2, :supplemental => false, :random_words_to_add => 1) }
    slug         { name.parameterize }
    account_type { "premium" }

    address1 { Faker::Address.street_name }
    zip      { Faker::Address.zip_code    }
    city     { Faker::Address.city        }
    country  { Faker::Address.country     }
  end
end
