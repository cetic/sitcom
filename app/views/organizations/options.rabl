collection @organizations

node :label do |organization|
  organization.name
end

node :value do |organization|
  organization.id
end
