webpack: bin/webpack-dev-server
sidekiq-websockets: bundle exec sidekiq -c 1 -q websockets
sidekiq-default: bundle exec sidekiq -c 1 -q default
log: tail -f log/development.log
elasticsearch: docker run --rm   --name elasticsearch-sitcom -p 9201:9200 -p 9301:9300 -e "discovery.type=single-node" -v "$PWD/.docker/elasticsearch/data":/usr/share/elasticsearch/data elasticsearch:7.4.2
