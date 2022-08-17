# Northcoders News Project

## About

Northcoders news is an API designed as the backend for a news app. The API interacts with data and allows for the following functionality:

- GET requests for users, topics, articles and their comments
- GET requests for articles by an identifier
- PATCH requests to add or remove votes
- POST new comments
- DELETE comments
- Articles can be filtered by topic and sorted in specified orders.

## Hosted Version

Northcoders News is hosted on Heroku, you can find it here:

https://leonie-phelps-nc-news-be.herokuapp.com/api

The first page displays a list of available endpoints and their description.  
To make POST, PATCH or DELETE requests please use insomnia, available here: https://insomnia.rest

# Installation

This project was made using Node.js version 16.14.2 and Postgres version 14. It is recommended that at least these versions are installed.

## 1. Cloning

To run this project locally please fork the project from GitHub:
https://github.com/LeoniePhelps/BE-NC-News

Clone the repository to your device by running the following code in your terminal:

```
git clone <project-name>
```

## 2. Dependencies

Once you have created a local copy of this repository, you will need to install the required dependencies with the following commands:

- jest `npm install -d jest`
- jest-sorted `npm install -d jest-sorted`
- pg-format `npm install -d pg-format`
- supertest `npm install -d supertest`
- express `npm install express`
- dotenv `npm install dotenv`
- nodemon `npm install nodemon`

## 3. Environment Variables

To successfully connect to the two databases locally, you will need to create two environment variable files:

```
.env.test
.env.development
```

Into each, add **PGDATABASE=<database_name_here>**, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

## 4. Database

To set up and seed the database, please run the following lines of code:

```
npm run setup-dbs
npm run seed
```

## 5. Testing

The tests for this API are located in the `__tests__` folder. To run the tests, please run this command:

```
npm test app.test
```
