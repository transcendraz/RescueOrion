# Client of Rescue Orion

Client app of the online Rescue Orion project, built with React.


## Environment Variables
Create a file in this directory named `.env` and put
```
REACT_APP_API_BASE_URL=<API base address>
```
as the file content.

### Homepage
In package.json, you will find an entry called "homepage." That is the field for the home page url of this application. For example, if you plan to host it on `https://play-rescue-orion.com`, then put that value in the homepage entry.

## yarn commands
- yarn install
  - Installs all dependencies, needs to be run the first time you run this project.
- yarn start
  - Starts the app in development mode.
- yarn build
  - Compiles the project in production mode in `build/`. The output will be a *static site*.
- yarn test
  - Starts an interactive console for running tests.

## Testing
All the tests files are in [src/__tests__](src/__tests__). They use [jest](https://jestjs.io/docs/en/getting-started).

In order to run the tests, you need a couple of test accounts on the backend. We need to add them manually to `/server/credentials.csv` because there is no registration process. Please append the following entries to that file:
```
RoomTest,randompasswordfortesting1023
GameboardTest,randompasswordfortesting1023
LobbyTest,randompasswordfortesting1023
LobbyTest2,randompasswordfortesting1023
```
These accounts are not needed in production.

## Deployment
After setting up the environment variables and homepage for production, run `yarn build` to generate the static site output and host the files in `build/` like any other static site project. You may choose to only upload the `build/` directory to your server.
