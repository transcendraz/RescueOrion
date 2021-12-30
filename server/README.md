# Server of Rescue Orion

Server app of the online Rescue Orion project.


## Environment Variables
Create a file in this directory named `.env` and put
```
JWT_SECRET=<your choice of secret string>
CLIENT_DOMAIN=<the domain of client app, used for CORS check>
NODE_ENV=<production/development>
```
as the file content.

### Persistent Storage
There is no database for this project. The only persistent data are the account credentials for admins of the game, which are stored in `credentials.csv`.

Currently, there are two sample accounts in it. In order to add/remove admins or to change passwords, modify the file directly. The program does not cache the file in-memory and reads the file every time for authentication.

## yarn commands
- yarn install
  - Installs all dependencies, needs to be run the first time you run this project.
- yarn run develop
  - Starts the app in development mode with `nodemon` and `ts-node`.
- yarn build
  - Compiles the project into `dist/`. The output is still a Node.js project that needs to be run with the Node interpreter.
- yarn start
  - Compiles the project with `tsc` into `dist/`.
  - Starts the app with `node .`
- yarn test
  - Runs all unit tests once.
- yarn run watch-test
  - Starts an interactive console for running tests.

## Testing
All the tests files are in [src/__tests__](src/__tests__). They use [jest](https://jestjs.io/docs/en/getting-started). They should be run with `NODE_ENV=development`.

If you run `yarn run watch-test`, there will be an interactive console. You might need to `npm install --global npx` to install the `npx` package in order to use the interactive console.

## Deployment
After setting up the environment variables for production, you could use `yarn start` to boot up the server directly or use a Node process manager like `pm2`. With a process manager, though, it is likely that you will need to `yarn build` first to generate `dist/` files and then to use `dist/index.js` as the entry point.

Just a side note, `yarn build` is the first step in `yarn start`.
