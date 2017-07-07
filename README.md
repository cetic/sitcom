# SItCOM / LLiW

License : MIT.

## Development

```sh
bundle install
bundle exec rails db:migrate:reset
bundle exec rails db:seed
bundle exec rake environment elasticsearch:import:all FORCE=true
bundle exec rails server
```

```sh
bundle exec sidekiq -c 1
```

## Production

See `DEPLOY.md` on how to deploy on a Ubuntu server.

## TODO

 * Adapter API pour tags/custom fields
 * Ajouter filtre avancés pour nouveaux liens (projects, events, tags, etc.)
