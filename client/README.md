### Set API Secrets

run `cd API && dotnet user-secrets set "TokenKey" "some-complex-secret-string-here"`<br />
run `cd API && dotnet user-secrets set "Cloudinary:CloudName" "your-name-here"`<br />
run `cd API && dotnet user-secrets set "Cloudinary:ApiKey" "your-api-key-here"`<br />
run `cd API && dotnet user-secrets set "Cloudinary:ApiSecret" "your-api-secret-here"`<br />

## Available Scripts

In the project directory, you can run:

### `cd client && npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `cd client && npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `cd client && npm run build`

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
