FactoryGirl.define do
  factory :contact do
    association  :lab

    first_name         { Faker::Name.first_name }
    last_name          { Faker::Name.last_name }
    email              { Faker::Internet.email }
    address_street     { Faker::Address.street_name + ', ' + Faker::Address.building_number }
    address_zip_code   { Faker::Address.zip_code }
    address_city       { Faker::Address.city }
    address_country    { Faker::Address.country }
    phone              { Faker::PhoneNumber.phone_number }
    active             { rand(2) == 1 }
    remote_picture_url { rand(5) == 1 ? Faker::Avatar.image : '' }

    twitter_url  { rand(2) == 1 ? "twitter.com/#{Faker::Internet.user_name}"  : '' }
    linkedin_url { rand(2) == 1 ? "linkedin.com/#{Faker::Internet.user_name}" : '' }
    facebook_url { rand(2) == 1 ? "facebook.com/#{Faker::Internet.user_name}" : '' }
    website_url  { rand(2) == 1 ? Faker::Internet.url : ''                         }
  end
end

