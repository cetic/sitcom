attributes :id, :name, :description,
           :start_date, :end_date, :picture_url

child :contacts do
  attributes :id, :name
end
