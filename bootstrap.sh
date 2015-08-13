#!/usr/bin/env bash

apt-get update
apt-get install -y nginx npm git

#Setting Env Variables
SRC="/vagrant"
PATH=./node_modules/.bin:$PATH

# Setup of nginx.
# If there are syncing issues, look into `sendfile`
rm -rf /usr/share/nginx/html
ln -s /vagrant /usr/share/nginx/html

# Linking up node, as this is an issue with ubuntu
ln -s /usr/bin/nodejs /usr/bin/node


# Install npm dependencies
cd $SRC
npm install


# Buld Project
tsc
