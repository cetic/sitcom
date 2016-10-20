attributes :id, :name, :description,
           :happens_on, :place,
           :website_url, :picture_url

child :contacts do
  attributes :id, :name
end
