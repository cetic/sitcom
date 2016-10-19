collection @labs
attributes :id, :name

node :url do |lab|
  lab_url(lab)
end
