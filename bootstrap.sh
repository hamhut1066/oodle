#!/usr/bin/env bash

apt-get update
apt-get install -y nginx

rm -rf /usr/share/nginx/html
ln -s /vagrant /usr/share/nginx/html
