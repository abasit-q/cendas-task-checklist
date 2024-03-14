<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">This app is built using Nest.js</p>

## Description

CENDAS assessment for backend developer. Details can be found [here](https://cendas.notion.site/Backend-Assessment-877aa6815f8f42d3abb6f07c548bbb13).

# Getting started

## Installation

Clone the repository

    git clone https://github.com/abasit-q/cendas-task-checklist.git

Switch to the repo folder

    cd cendas-task-checklist

Install dependencies

    yarn install

Copy .env.example file to .env

    cp .env.example .env

---

## Database

Set postgres database settings in .env

    DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE"

To create all tables in the new database make the database migration from the Prisma schema defined in prisma/schema.prisma

    npx prisma migrate deploy

Now generate the Prisma client from the migrated database with the following command

    npx prisma generate

The database tables are now set up and the Prisma client is generated.

---

## YARN scripts

- `yarn start` - Start the application
- `yarn start:dev` - Start the application in dev/watch mode
- `yarn test` - Run the Jest test runner
- `yarn build` - Build the application
- `yarn start:prod` - Start the application from build

---

## Swagger API docs

Navigate to `http://localhost:[PORT]/api-doc` after running the dev server to access API docs.

[NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)

# Task Stats

## Time Log

- Code: 4 hours
- Unit tests/tests coverage: 4 hours
- Total Time: 8 hours

## Demo

<p>Click on the thumbnail to watch:</p>

[![Video Thumbnail](https://img.youtube.com/vi/nIW4dKeRJII/0.jpg)](https://www.youtube.com/watch?v=nIW4dKeRJII)

## Test Coverage

  <img src="https://my-cdn-001.s3.amazonaws.com/test-stats.png" alt="Test Coverage" />

