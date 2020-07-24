![Logo](https://i.imgur.com/2WG09lT.png)

Perseus: Seocraft Network official Backend
===================
This repository contains the essential code for all the services that are involved in Seocraft Network to work, such as [Centauri](https://github.com/SeocraftNetwork/Centauri) or [Polaris](https://github.com/SeocraftNetwork/Polaris).

# License

The code within this repository should not be released to anyone outside of the Seocraft Network.
Once access granted, the user will accept all legal / administrative responsibilities
Failure to comply with the foregoing Any attempt to disclose to persons outside the Seocraft Network and / or persons authorized by the same entity, will be legally penalized according to [Decision 486 of the year 2000 - Article 257](http://www.wipo.int/edocs/lexdocs/laws/en/can/can012en.pdf).

## Introduction

Let's start with a simple and annoying question. Why TypeScript? Express.js is great frameworks for making a NodeJS REST APIs however it doesn't give you any clue on how to organizing your NodeJS project.

While it may sound silly, this is a real problem. The correct organization of your NodeJS project structure will avoid duplication of code, will improve stability, and potentially, will help you scale your services if its done correctly.

Along with TypeScript provided functions and architecture described below Perseus will preserve scalability.

## Install Backend App

Install the following services and set them on the ports indicated in the configuration:
* [NodeJS 8.11.3](https://nodejs.org/es/)
* [MongoDB](http://www.mongodb.org/)
* [Redis](http://redis_service.io/)

Make sure you install all the packages correctly: `npm install`

## Folder Structure

```
src
  │   app.js          # App entry point
  └───api             # Express route controllers for all the endpoints of the app
  └───config          # Environment variables and configuration related stuff
  └───decorators      # Annotation helpers to be provided if needed
  └───interfaces      # Interfaces provided to enhace abstraction in the project with TypeScript functionallity
  └───jobs            # Jobs definitions for agenda.js
  └───loaders         # Split the startup process into modules
  └───models          # Database models
  └───services        # All the business logic is here
  └───subscribers     # Event handlers for async task
  └───views           # If needed, some service mixins to ensure correctly presentation will be placed here
  └───types           # Type declaration files (d.ts) for Typescript
  └───utilities       # Utilities used across the project to avoid duplication
```

## Three (Sometimes four) Layer Architecture

The idea is to use the **principle of separation of concerns** to move the business logic away from the NodeJS API Routes.

TODO: 3/4 Graphic

Because someday, you will want to use your business logic on a CLI tool, or not going far, in a recurring task. nd make an API call from the NodeJS server to itself it's not a good idea...

### Controller

You may be tempted to just use the express.js controllers to store the business logic of your application, but this quickly becomes spaghetti code, as soon as you need to write unit tests, you will end up dealing with complex mocks for `req` or `res` express.js objects.

It's complicated to distingue when a response should be sent, and when to continue processing in 'background', let's say response will be sent after the client.

### Service Layer

This layer is where your business logic should live. It's just a collection of classes with clear purposes, following the SOLID principles applied to NodeJS.

_In this layer there should not exist any form of 'Mongo query', use the data access layer for that._

* Move your code away from the express.js router.
* Don't pass the `req` or `res` object to the service layer.
* Don't return anything related to the HTTP transport layer like a status code or headers from the service layer.

### The "fourth" Layer

Sometimes provided functions at services could not be enough to supply the requested data for a request, so here relays what we call the *Presentation Layer*, where you can mix services functionality to generate a more viewable result, also some data that must not be shown to the final user.

_Useful example: Final views of the Perseus forum must be processed here to restrict the user to access not allowed topics/posts in order to prevent a Mongoose middleware who checks every requested object._

## Pub/Sub Layer

The pub/sub pattern goes beyond the classic 3 layer architecture proposed here, but it's extremely useful.

The simple NodeJS API endpoint that creates a user right now, may want to call third-party services, maybe to an analytics service, or maybe start an email sequence. Sooner than later, that simple "create" operation will be doing several things, and you will end up with 1000 lines of code, all in a single function.

That violates the principle of single responsibility. So, it's better to separate responsibilities from the start, so your code remains maintainable.

## Dependency Injection

D.I. or inversion of control (IoC) is a common pattern that will help the organization of your code, by 'injecting' or passing through the constructor the dependencies of your class or function.

By doing this way you will gain the flexibility to inject a 'compatible dependency' when, for example, you write the unit tests for the service, or when you use the service in another context.

```TypeScript
import {Service} from 'typedi';
    
@Service()
export default class UserService {
    constructor(
        private userModel
    ){}

    getMyUser(userId) {
        return this.userModel.findById(userId);
    }
}
```

### Using dependency injection in NodeJS

Using D.I. in express.js is the final piece of the puzzle for this NodeJS project architecture.

```TypeScript
route.post('/', 
    async (req, res, next) => {
      const userDTO = req.body;
      const userServiceInstance = Container.get(UserService)
      const { user, company } = userServiceInstance.Signup(userDTO);
      return res.json({ user, company });
    });
```

## Cron Jobs and recurring tasks

So, now the business logic encapsulated into the service layer, it's easier to use it from a Cron job.

You should never rely on NodeJS setTimeout or another primitive way of delay the execution of code, but on a framework that persist your jobs, and the execution of them, in a database.

This way you will have control over the failed jobs, and feedback of those who succeed. In this case we use [Agenda](https://github.com/agenda/agenda), a lightweight framework.

## Loaders

A classic NodeJS app initialization will have an express.js file in charge of mongo, redis, routes, so far and so on. 

Actually Perseus divides their loading tasks in several files, based on the [W3Tech Microframework](https://www.npmjs.com/package/microframework-w3tec) without direct implementation of the package itself.

## Configuration

Following the battle-tested concepts of [Twelve-Factor App](https://12factor.net/) for NodeJS the best approach to store API Keys and database string connections, it's by using [dotenv](https://www.npmjs.com/package/dotenv).

Put a .env file, that must never be committed (but it has to exist with default values in Perseus) then, the npm package dotenv loads the `.env` file and insert the vars into the `process.env` object of NodeJS.

That could be enough but, Perseus has an extra step. A `config/index.ts` file where the dotenv npm package and loads the `.env` file and then use an object to store the variables, so we have a structure and code auto completion.

This way you avoid flooding the project code with `process.env.MY_RANDOM_VAR` instructions, and by having the auto completion, so you don't have to know how to name the env var.
