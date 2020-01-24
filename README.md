# SItCOM CRM

License : MIT.

## Development

```sh
bundle install
bundle exec rails db:migrate:reset
bundle exec rails db:seed
bundle exec rails app:bootstrap
bundle exec rake environment elasticsearch:import:all FORCE=true
bundle exec rails server
```

```sh
yarn
./bin/webpack-dev-server
```

```sh
bundle exec sidekiq -c 1
```

### Run an ElasticSearch 2 container (optional)

```sh
docker run --name elasticsearch-sitcom --restart=always -d -p 9201:9200 -p 9301:9300 -e "discovery.type=single-node" -v "$PWD/.docker/elasticsearch/data":/usr/share/elasticsearch/data elasticsearch:7.4.2
```

## Tests

```sh
bundle install
RAILS_ENV=test bundle exec rails db:create
RAILS_ENV=test bundle exec rails db:migrate
bundle exec rspec
```

## Production

See `DEPLOY.md` on how to deploy on a Ubuntu server.
