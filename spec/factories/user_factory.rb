FactoryBot.define do
  factory :user do
    name                  { Faker::Name.first_name + ' ' + Faker::Name.last_name }
    admin                 { false                                                }
    email                 { Faker::Internet.email                                }
    password              { 'testtest'                                           }
    password_confirmation { password                                             }
  end
end

