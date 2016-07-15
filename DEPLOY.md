# Server Deployment Docs

For Ubuntu 16.04 LTS (Xenial).

## Create a SSH key pair for **deploy** user

Then, create SSH keys (no passphrase):

    su deploy
    cd ~
    ssh-keygen -t rsa

Upload the public key to BitBucket/Github:

    cat .ssh/id_rsa.pub
    exit

## Base setup

As root:

    apt-get update
    apt-get upgrade

    apt-get install zlib1g zlib1g-dev build-essential git-core curl emacs imagemagick nginx
    apt-get install mysql-client libmysqlclient-dev libopenssl-ruby1.9.1 libssl-dev libreadline-dev
    apt-get install mysql-server monit unattended-upgrades logrotate memcached nodejs
    apt-get install libcurl4-gnutls-dev libxml2 libxml2-dev libxslt1-dev ruby-dev
    apt-get install mysql-client libmysqlclient-dev libssl-dev libreadline-dev screen
    apt-get install libmagickcore-dev libmagickwand-dev

Set a [generated password](https://strongpasswordgenerator.com) for mysql root and save it somewhere.

## Enable automatic security updates

As root:

    unattended-upgrades

## Install `rbenv` and `ruby` (as deploy)

    git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
    echo 'eval "$(rbenv init -)"' >> ~/.bash_profile

    git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
    exec $SHELL -l

    export RUBY_VERSION=2.3.1
    rbenv install $RUBY_VERSION
    rbenv global $RUBY_VERSION
    gem install bundler
    rbenv rehash

    wget https://raw.github.com/ryanb/dotfiles/master/gemrc -O .gemrc
    echo 'export RAILS_ENV="production"' >> ~/.bash_profile

## Create MySQL database for the project

Launch the MySQL CLI client:

    mysql -u root -p

Use a [generated password](https://strongpasswordgenerator.com) and store it somewhere. Then:

    mysql> create database `sitcom` character set 'utf8mb4' collate 'utf8mb4_unicode_ci';
    mysql> create user deploy;
    mysql> grant all on `sitcom`.* to 'deploy'@'localhost' identified by 'SuperGeneratedPassword';
    mysql> flush privileges;

## Configure nginx

### Passenger

Install [Phusion Passenger](https://www.phusionpassenger.com/library/install/nginx/install/oss/xenial/).

### Server block

Create a file in **/etc/nginx/sites-available/sitcom** :

    server {
      listen 80;
      server_name sitcom.cetic.be;

      access_log /var/log/nginx/sitcom.access.log;
      sendfile on;
      root /home/deploy/apps/sitcom/current/public;

      gzip on;
      gzip_disable "msie6";

      passenger_enabled on;
      passenger_ruby /home/deploy/.rbenv/shims/ruby;
      passenger_app_env production;
      passenger_friendly_error_pages on;

      location ~ ^/(assets)/  {
        root /home/deploy/apps/sitcom/current/public;
        gzip_static on;
        expires     max;
        add_header  Cache-Control public;
      }

      client_max_body_size 300M;
    }

Enable the server block:

    ln -s /etc/nginx/sites-available/sitcom /etc/nginx/sites-enabled/sitcom

Then restart nginx:

    service nginx restart

## Setup ElasticSearch (option)

Setup [repositories](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup-repositories.html).

Then:

    apt-get update
    apt-get upgrade
    apt-get update && sudo apt-get install elasticsearch
    apt-get install openjdk-8-jre
    service elasticsearch start

### Deploy for the first time

Create the env file in `/home/deploy/apps/sitcom/shared/.env.production`. Then:

    bundle exec cap production deploy:check
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

    sudo logrotate /etc/logrotate.conf
