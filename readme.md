# Users API

## Technologies

- NodeJs
- Express
- TypeScript
- MongoDB
- Jest
- Redis
- Docker

## Concepts

- SOLID
- Dependency Injection
- Repository Pattern
- Unit tests

## Routes

- GET /users - returns users saved in the database
- GET /users/:id - return data from a specific database user
- POST /users - create an user
- PUT /users/:id - update an user
- DELETE /users/:id - deleta an user
- GET /users/:identity/account - get user by account number
- GET /users/:identity/identity-number - get user by identity number

## Plus

- Docker to mongoDB
- ESLint

# Run

This project was developed to run with Docker. However, for those who prefer an alternative, it is possible to use Mongo Atlas, a cloud platform specialized in MongoDB. In my local configuration I used Docker, while for deployment I opted for Mongo Atlas.

If you decide to use Atlas, be sure to modify the database settings in the .env file. The remaining general functionality and operation of the project will remain consistent.

Another note is that I chose Yarn as the package manager for this project. To run the project, you can use `npm run start:dev` or `npm run test` and you can find these commands specified in the package.json file.

Also, it's important to note that I used `docker-compose` to manage my Docker files. Before starting the project, make sure the database container is up and running. Failure to do so may result in errors, especially when trying to perform certain functionality, such as running tests that depend on database access.

## Documentation

You can see documentation API with postman

`https://documenter.getpostman.com/view/3483861/2sA3Bn5sLr`

## Using Docker

### Running

`docker-composer up -d`

`npm run start:dev`

To run the tests you can use:

`npm run test`

This command will only be executed once. It is also possible to execute commands such as:

`npm run test --coverage`

This command will generate an coverage report about your code with your tests. It's interesting because this report it's based on code interruptions as if, while, for etc. So if you have simple 1 IF condition in a class for example. The test will considere that you need minimally two tests do coverage 100% conditions, one where the IF condition it's true, and other where the IF condition it's false.

`npm run test --watch`

This command will keep a tests tab open in your terminal, similar to what Nodemon does. So according you change and save something the tests will be re-executed.