collection @fields

node :label do |field|
  field.name
end

node :value do |field|
  field.id
end

node :highlight do |field|
  field.parent_id.nil?
end
