JWT-Auth-Tasks-API

A simple Node.js API with JWT authentication for user registration and login, plus protected routes to manage tasks (create, read, update, delete). Includes a basic front-end (HTML/CSS/JS) for testing.

Features

* User registration with hashed passwords (bcrypt)
* User login with JWT token generation
* Protected routes using JWT authentication
* Create, list, delete, rename and complete tasks
* Tasks are linked to individual users
* Simple front-end to test the API

Technologies

* Node.js
* Express
* MySQL
* bcrypt
* JSON Web Tokens (JWT)

Setup

1. Clone the repository:

git clone <your-repo-url>
cd <repo-folder>

2. Install dependencies:

npm install

3. Import the local database dump:

* Make sure MySQL is installed locally
* Create an empty database (name must match .env):

CREATE DATABASE finaldb;

* Import the dump file:

mysql -u root -p finaldb < finaldb_dump.sql

4. Create a .env file with your environment variables:

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=finaldb

5. Run the server:

node index.js

API Endpoints

Auth

* POST /auth/register
  Register a new user
  Body: { "username": "user", "password": "pass" }

* POST /auth/login
  Login and get a JWT token
  Body: { "username": "user", "password": "pass" }

Tasks (Protected)

All routes below require:
Headers: Authorization: <token>

* POST /auth/tasks
  Create a new task
  Body: { "title": "Task title", "done": false }

* GET /auth/tasks
  Get all tasks of the logged-in user

* DELETE /auth/tasks
  Delete a task
  Body: { "task_id": 1 }

* PUT /auth/tasks/rename
  Rename a task
  Body: { "task_id": 1, "new_task_name": "New name" }

* PUT /auth/tasks/complete
  Mark task as done or not done
  Body: { "task_id": 1, "done": true }

Notes

* Store the JWT token in the client (localStorage, sessionStorage, or cookies) to access protected routes.
* The Authorization header must contain the token returned on login.
* Tasks are always linked to the authenticated user.
* The database is local and contains dummy data for testing.
* The project includes a simple front-end located in the "front" folder.
