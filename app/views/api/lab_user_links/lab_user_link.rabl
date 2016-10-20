attributes :lab_id

node :lab_name do |lab_user_link|
  lab_user_link.lab.name
end

node do |lab_user_link|
  lab_user_link.permissions
end
