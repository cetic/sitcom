collection @saved_searches
attributes :id, :name, :search

node :is_public do |saved_search|
  saved_search.user_id.blank?
end
