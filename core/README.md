## Description


## Installation

```bash
$ npm install
```

## Development
### Google storage upload
To upload files to google storage from the local env, a service account has been created
with the appropriate permissions.

GCP allows exporting credentials for this service account, which can be used to get local access to upload files.

The env file should contain the following variable IM_KIT_SERVICE_ACCOUNT_PATH with the correct path on the local file system towards the credentials file.

### Connection to production database
Cloud SQL Proxy is required to be running such that a connection to the production DB can be established at application init.
To run the auth proxy and establish an ssh tunnel to the DB run
```bash
./cloud_sql_proxy -instances=clean-wonder-346011:europe-west4:core-db=tcp:3306
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
