# SItCOM CRM

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/cetic/sitcom/master.svg?style=flat-square)](https://travis-ci.org/cetic/sitcom)

Sitcom is a CRM that connects persons, organisations and projects for Living Labs.

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

### Run an ElasticSearch 7.4.2 container (optional)

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

See `DEPLOY.md` on how to deploy on a Debian server.

## API

The API documentation is accessible on `https://domain.com/api/docs/index.html`

It was generated with [Slate](https://github.com/slatedocs/slate) and the repository was forked here: https://github.com/aurels/sitcom-apidocs

## Misc

SItCOM CRM uses [Bugsnag](https://bugsnag.com) for bugtracking.

![Bugsnag](https://avatars3.githubusercontent.com/u/1058895?s=200&v=4)
