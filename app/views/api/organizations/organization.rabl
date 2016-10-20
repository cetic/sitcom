attributes :id, :name, :status, :description,
           :website_url, :picture_url

child :contacts do
  attributes :id, :name
end
