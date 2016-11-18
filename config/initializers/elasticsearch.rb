if Rails.env.development? && ENV['USER'] == 'aurels'
  Elasticsearch::Model.client = Elasticsearch::Client.new({
    :url => 'http://127.0.0.1:9201',
  })
else
  Elasticsearch::Model.client = Elasticsearch::Client.new({
    :url => 'http://127.0.0.1:9200'
  })
end
