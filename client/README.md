## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `cd API && dotnet run watch`

Runs the .NET Core Api with hot reload enabled

### `dotnet ef database drop -p Persistence/ -s API/`

Will drop local db. Running api again will automatically seed data.

### `dotnet new classlib -n <name>`

Create new class library

### `dotnet sln add <name>`

Add class library to the solution

### `dotnet user-secrets set "TokenKey" "<your-development-token key>" -p API/`

Run from root of project to create a dev jwt token key
