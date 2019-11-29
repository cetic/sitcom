# Server Deployment Docs

For Debian 9 (buster).

## Create a **deploy** user

    adduser deploy

Then, create SSH keys (no passphrase):

    su deploy
    cd ~
    ssh-keygen -t rsa

Upload the public key to BitBucket/Github:

    cat .ssh/id_rsa.pub
    exit

## Base setup

As root:

    apt update
    apt upgrade

    apt install zlib1g zlib1g-dev build-essential git-core curl emacs imagemagick nginx screen
    apt install libmariadb-dev-compat libmariadb-dev libssl-dev libreadline-dev
    apt install mariadb-server monit unattended-upgrades logrotate memcached redis-server
    apt install libcurl4-gnutls-dev libxml2 libxml2-dev libxslt1-dev ruby-dev
    apt install libmagickcore-dev libmagickwand-dev

Set a [generated password](https://strongpasswordgenerator.com) for mysql root and save it somewhere.

## Enable automatic security updates

As root:

    unattended-upgrades

## Add some SWAP

    fallocate -l 8G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    swapon -s
    free

Make it persistent on `/etc/fstab`:

    /swapfile   none    swap    sw    0   0

## Install nodejs

https://github.com/nodesource/distributions/blob/master/README.md

    curl -sL https://deb.nodesource.com/setup_13.x | bash -
    apt install -y nodejs

## Install yarn

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
    apt update
    apt install yarn

## Install `rbenv` and `ruby` (as deploy)

    su deploy
    cd ~

    git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
    echo 'eval "$(rbenv init -)"' >> ~/.bash_profile

    git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
    exec $SHELL -l

    export RUBY_VERSION=2.6.5
    rbenv install $RUBY_VERSION
    rbenv global $RUBY_VERSION
    gem install bundler
    rbenv rehash
    wget https://raw.github.com/ryanb/dotfiles/master/gemrc -O .gemrc
    echo 'export RAILS_ENV="production"' >> ~/.bash_profile

## Create MySQL database for the project

Launch the MySQL CLI client:

    mysql

    mysql> create database `sitcom` character set 'utf8mb4' collate 'utf8mb4_unicode_ci';
    mysql> create user deploy;
    mysql> grant all on `sitcom`.* to 'deploy'@'localhost' identified by 'SuperGeneratedPassword';
    mysql> flush privileges;

## Configure nginx

### Passenger

https://www.phusionpassenger.com/docs/advanced_guides/install_and_upgrade/standalone/install/oss/buster.html

    apt install -y dirmngr gnupg
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
    apt install -y apt-transport-https ca-certificates
    sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger buster main > /etc/apt/    sources.list.d/passenger.list'
    apt update
    apt install -y passenger libnginx-mod-http-passenger
    /usr/bin/passenger-config validate-install

### Server block

Create a file in **/etc/nginx/sites-available/sitcom** :

    server {
      listen 80;
      listen 443;
      server_name sitcom.cetic.be;

      access_log /var/log/nginx/sitcom.access.log;
      sendfile on;
      root /home/deploy/apps/sitcom/current/public;

      gzip on;
      gzip_disable "msie6";

      passenger_enabled on;
      passenger_ruby /home/deploy/.rbenv/shims/ruby;
      passenger_app_env staging;
      passenger_friendly_error_pages on;

      location ~ ^/(assets)/  {
        root /home/deploy/apps/sitcom/current/public;
        gzip_static on;
        expires     max;
        add_header  Cache-Control public;
      }

      location /cable {
        passenger_app_group_name sitcom_action_cable;
        passenger_force_max_concurrent_requests_per_process 0;
      }

      client_max_body_size 300M;
    }

Enable the server block:

    unlink /etc/nginx/sites-enabled/default
    ln -s /etc/nginx/sites-available/sitcom /etc/nginx/sites-enabled/sitcom

Then restart nginx:

    systemctl restart nginx

## Setup ElasticSearch (2.1.2)

    apt install default-jdk
    apt install apt-transport-https
    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
    add-apt-repository "deb https://artifacts.elastic.co/packages/7.x/apt stable main"
    apt update
    apt install elasticsearch
    systemctl enable elasticsearch.service
    systemctl start elasticsearch.service

### Deploy for the first time

    bundle exec cap production deploy:check

Create the env file in `/home/deploy/apps/sitcom/shared/.env`. Then:

    bundle exec cap production deploy

## Configure logrotate

In **/etc/logrotate.d/sitcom**:

    /home/deploy/apps/sitcom/shared/log/*.log {
      daily
      missingok
      rotate 15
      compress
      delaycompress
      notifempty
      copytruncate
    }

Test it:

    logrotate /etc/logrotate.conf

## Configure sidekiq

As root :

Set the Storage directive of the [Journal] section of
`/etc/systemd/journald.conf` to persistent (instead of auto or volatile).
Reboot after editing the configuration.

As deploy, iunstall systemd services :

* Copy `config/server/systemd/sidekiq-default.service` to `/home/deploy/.config/systemd/user/sidekiq-default.service`.
* Copy `config/server/systemd/sidekiq-websockets.service` to `/home/deploy/.config/systemd/user/sidekiq-websockets.service`.

Then :

    systemctl --user enable sidekiq-default
    systemctl --user enable sidekiq-websockets
    systemctl --user start sidekiq-default
    systemctl --user start sidekiq-websockets

Unsefull commands :

    systemctl --user status sidekiq-default
    journalctl --user -fu sidekiq-default

## Configure Monit

* Copy config files from `config/server/monit/conf.d` to `/etc/monit/conf.d`.

Activate web UI in `/etc/monit/monitrc` :

    set httpd port 2812 and allow monit:PasswordToChange

## Certbot / https

    apt install python-certbot-nginx certbot
    certbot --nginx -d sitcom.cetic.be
