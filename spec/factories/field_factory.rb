FactoryBot.define do
  factory :field do
    association :lab

    name { Faker::Company.buzzword  }
  end
end

