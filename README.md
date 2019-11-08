# SItCOM / LLiW

License : MIT.

## Development

```sh
bundle install
bundle exec rails db:migrate:reset
bundle exec rails db:seed
bundle exec rake environment elasticsearch:import:all FORCE=true
yarn
bundle exec rails server
```

```sh
./bin/webpack-dev-server
```

```sh
bundle exec sidekiq -c 1
```

### Run an ElasticSearch 2 container (optional)

```sh
docker run --name elasticsearch-sitcom --restart=always -d -p 9201:9200 -p 9301:9300 -v "$PWD/.docker/elasticsearch/data":/usr/share/elasticsearch/data elasticsearch:2.1.2
```

## Production

See `DEPLOY.md` on how to deploy on a Ubuntu server.

## TODO

