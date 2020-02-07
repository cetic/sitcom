Elasticsearch::Model.client = Elasticsearch::Client.new(
  :url => ENV['ELASTIC_SEARCH_URL']
)
