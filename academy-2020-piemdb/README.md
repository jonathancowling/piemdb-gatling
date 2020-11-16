# academy-2020-piemdb

## Steps to install dev environment
- run `./getToThaChoppa.sh`

## Steps to spin up local dev DB
- run `docker-compose up -d`
- cd into scripts and run `TABLE_NAME=PieMDB-database-${stage} node seed-ddb.js` 
    - may have to kill current docker image: below commands nuke all containers!
        - docker kill $(docker ps -q)
        - docker rm $(docker ps -a -q)
        - docker rmi $(docker images -q)
- create a search index by running `npm start` from the `index-builder` directory

## Steps to run app in dev environment
- cd into app-api and run `npm run dev`
- cd into app and run `npm start`

## Steps to run app in prod environment - for the CICD
- cd into app-api and run `npm run prod`
- cd into app and run `npm run build-prod`

## Set up NOSQL workbench
- import the PIEMDB.json as a data model 'NOSQLPieMDB.json'
