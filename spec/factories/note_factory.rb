FactoryGirl.define do
  factory :note do
    association :notable # can be event, project, organization or contact

    text    { Faker::Lorem.paragraph(2, false, 4) }
    privacy { rand(2) == 1 ? :private : :public }
  end
end
