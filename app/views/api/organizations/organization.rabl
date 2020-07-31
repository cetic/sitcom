attributes :id, :name, :status, :description,
           :website_url, :picture_url,
           :company_number,
           :address1, :address2, :city, :state, :zip, :country,
           :twitter_url, :facebook_url, :linkedin_url

child :contacts do
  attributes :id, :name
end
