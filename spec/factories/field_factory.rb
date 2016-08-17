FactoryGirl.define do
  factory :field do
    association :parent

    name { Faker::Company.buzzword  }
  end
end

