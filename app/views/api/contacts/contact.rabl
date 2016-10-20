attributes :id, :name, :first_name, :last_name, :active, :email, :phone,
           :twitter_url, :linkedin_url, :facebook_url, :picture_url,
           :address, :address_street, :address_zip_code, :address_city, :address_country

child :organizations do
  attributes :id, :name
end

child :projects do
  attributes :id, :name
end

child :events do
  attributes :id, :name
end

child :fields do
  attributes :id, :name
end
