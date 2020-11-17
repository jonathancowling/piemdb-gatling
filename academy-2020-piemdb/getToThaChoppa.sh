#!/bin/bash

#install in app
pushd app
echo 'installing app modules...'
npm install
echo 'installing app modules done'
popd

#install in app-api
pushd app-api
echo 'installing app-api modules...'
npm install
echo 'installing app-api modules done'
popd

#install in scripts
pushd scripts
echo 'installing scripts...'
npm install
echo 'installing scripts done'
popd

#install in index-builder
pushd index-builder
echo 'installing index-builder...'
npm install
echo 'installing index-builder done'
popd

# install in resources
pushd resources
echo 'installing resources...'
npm install
echo 'installing resources done'
popd
