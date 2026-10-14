# 🚀 W2 CRUD API — PostgreSQL, Docker & Supabase Authentication

A REST API built with Node.js and Express for managing tasks. The project uses PostgreSQL for persistent data storage, Docker Compose for containerization, and Supabase Authentication for user registration, login, and protected endpoints.

The API combines task management with authentication and authorization, while Swagger UI provides interactive API documentation.

## ✨ Features

### Task Management
- REST API built with Express
- Complete CRUD operations: Create, Read, Update, Delete
- Retrieve all tasks or a single task
- Input validation and appropriate HTTP status codes
- PostgreSQL database integration
- Separate PostgreSQL repository layer
- Automatic database and table initialization
- Persistent database storage using a Docker volume

### Authentication & Authorization
- User registration with Supabase Auth
- Login with email and password
- Access token and refresh token responses
- Access token verification using Supabase
- Reusable Express authentication middleware
- Protected user profile and dashboard endpoints
- Public information endpoint
- Logout endpoint
- HTTP Bearer token authentication

### API Documentation & Infrastructure
- Swagger UI at `/docs`
- OpenAPI specification with Bearer authentication
- Dockerized Node.js application
- Docker Compose for the application and PostgreSQL
- Environment-based configuration
- `.env.example` for configuration reference
- Git and GitHub version control

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| JavaScript | Programming language |
| Node.js | JavaScript runtime |
| Express | Web framework |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL client |
| Supabase Auth | User authentication |
| `@supabase/supabase-js` | Supabase JavaScript SDK |
| `dotenv` | Environment variable configuration |
| Docker | Application containerization |
| Docker Compose | Running application services |
| Swagger UI | Interactive API documentation |
| OpenAPI | API specification |
| Git | Version control |
| GitHub | Code hosting |

## 📦 Project Setup

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) project with its API URL and publishable/anon key

### Clone the repository

```bash
git clone https://github.com/AminaHeljaa/W2_CRUD_API.git
cd W2_CRUD_API
```

### Configure environment variables

Create a local `.env` file in the project root using `.env.example` as a reference.

Example configuration:

```env
PORT=3000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=tasks
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tasks

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_publishable_or_anon_key
```

Replace the example values with your actual local database credentials and Supabase project settings.

**Security:** Never commit `.env` or expose secret credentials in the repository. The `.env.example` file should contain placeholders, not real keys or passwords.

The `.env` file is excluded from Git tracking.

## 🐳 Running with Docker Compose

Make sure Docker Desktop is running.

Build the application image and start the services:

```bash
docker compose up --build -d
```

Check the service status:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs app
```

View database logs:

```bash
docker compose logs db
```

The application should be available at:

- **API:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/docs
- **Health check:** http://localhost:3000/health

The PostgreSQL database is available on port `5432` for local database access.

> Ensure that the environment variables required by the application are available to the app container through the Compose configuration.

### Stop the application

```bash
docker compose down
```

This stops and removes the containers while preserving the Compose-managed database volume.

To start the services again:

```bash
docker compose up -d
```

Do not use `docker compose down -v` if you want to preserve the database volume and stored tasks.

## 🗄️ Database

The application uses PostgreSQL for persistent task storage.

The database schema is defined in:

```text
db/schema.sql
```

The `tasks` table contains:

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Unique task identifier |
| `title` | Text | Task title |
| `done` | Boolean | Task completion status |

Example task:

```json
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": false
}
```

The PostgreSQL repository separates database operations from the Express routes.

### Persistent storage

PostgreSQL data is stored in a Docker volume named `taskdata`.

The volume preserves database records when the application containers are stopped or recreated, as long as the volume is not deleted.

## 🔐 Authentication

The application uses Supabase Auth to register and authenticate users.

After a successful login, the API returns an access token and a refresh token. The access token is used to access protected endpoints.

Protected routes use reusable Express middleware to extract the Bearer token and validate it with Supabase before returning the requested data.

### Authentication flow

1. Register a user using `/auth/signup`.
2. Log in using `/auth/login`.
3. Copy the returned `access_token`.
4. Open Swagger UI and click **Authorize**.
5. Enter the access token.
6. Execute protected requests.

The access token should be kept private and should not be committed to GitHub.

### Authentication endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in and receive tokens |
| POST | `/auth/logout` | Log out the authenticated user |

#### Register a user

**Request**

```http
POST /auth/signup
Content-Type: application/json
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "YourPassword123"
}
```

Expected status codes:

- `201 Created` — registration successful
- `400 Bad Request` — missing input or registration error

Supabase email confirmation settings may affect whether a session is immediately created during registration.

#### Log in

**Request**

```http
POST /auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "YourPassword123"
}
```

A successful response includes the user's access token and refresh token.

Example response structure:

```json
{
  "message": "Login successful.",
  "access_token": "<access-token>",
  "refresh_token": "<refresh-token>",
  "user": {
    "id": "<user-id>",
    "email": "user@example.com"
  }
}
```

Expected status codes:

- `200 OK` — login successful
- `400 Bad Request` — missing email or password
- `401 Unauthorized` — invalid credentials

#### Log out

**Request**

```http
POST /auth/logout
```

This endpoint requires a valid Bearer token.

Expected status codes:

- `204 No Content` — logout request successful
- `401 Unauthorized` — missing or invalid token

## 🔒 Public and Protected Routes

### Public information

**Request**

```http
GET /public/info
```

This endpoint is available without authentication.

Expected status: `200 OK`

### User profile

**Request**

```http
GET /protected/profile
```

Returns information about the authenticated user after token verification.

Expected status codes:

- `200 OK` — valid access token
- `401 Unauthorized` — missing, invalid, or expired token

### Protected dashboard

**Request**

```http
GET /protected/dashboard
```

This endpoint demonstrates the reusable authentication middleware on an additional protected route.

Expected status codes:

- `200 OK` — valid access token
- `401 Unauthorized` — missing, invalid, or expired token

### Bearer authentication

Protected requests use the following HTTP header:

```http
Authorization: Bearer <access-token>
```

The middleware verifies the token with Supabase and makes the authenticated user available to the route handler.

## 🔗 Task API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get API information |
| GET | `/health` | Check application/database health |
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Create a task

**Request**

```http
POST /tasks
Content-Type: application/json
```

Request body:

```json
{
  "title": "Buy milk"
}
```

Expected status codes:

- `201 Created` — task created
- `400 Bad Request` — invalid input

### Update a task

**Request**

```http
PUT /tasks/1
Content-Type: application/json
```

Request body:

```json
{
  "title": "Learn Express",
  "done": true
}
```

Expected status codes:

- `200 OK` — task updated
- `400 Bad Request` — invalid input
- `404 Not Found` — task does not exist

### Delete a task

**Request**

```http
DELETE /tasks/1
```

Expected status codes:

- `204 No Content` — task deleted
- `404 Not Found` — task does not exist

## 📖 Swagger UI

Interactive API documentation is available at:

**http://localhost:3000/docs**

Swagger UI provides a convenient way to test authentication and task endpoints without requiring a separate API client.

For protected routes:

1. Execute `POST /auth/login`.
2. Copy the `access_token` from the response.
3. Click **Authorize** in Swagger UI.
4. Enter the access token.
5. Click **Authorize** and close the dialog.
6. Execute `/protected/profile` or `/protected/dashboard`.

The OpenAPI specification defines HTTP Bearer authentication for protected endpoints.

### Swagger screenshot

Add a screenshot showing the Swagger documentation, including the authentication endpoints, protected routes, and the **Authorize** button.

Save the image at:

```text
docs/swagger-auth.png
```

Then include it in this section:

![Swagger UI showing authentication endpoints and protected routes](swagger-auth.png)

## 🧪 Testing

The API can be tested using Swagger UI, PowerShell, and Docker Compose.

### Check the API

```powershell
Invoke-RestMethod http://localhost:3000/health
```

### Get all tasks

```powershell
Invoke-RestMethod http://localhost:3000/tasks
```

### Test authentication

Use Swagger UI to verify the following scenarios:

| Test | Expected result |
|---|---|
| Register with valid input | `201` when registration succeeds |
| Login with valid credentials | `200` |
| Login with invalid credentials | `401` |
| Access public information without a token | `200` |
| Access profile without a token | `401` |
| Access profile with a valid token | `200` |
| Access dashboard without a token | `401` |
| Access dashboard with a valid token | `200` |
| Submit a logout request with a valid token | `204` |

### Test database persistence

1. Create a task using `POST /tasks`.
2. Stop the containers with `docker compose down`.
3. Start them again with `docker compose up -d`.
4. Retrieve the tasks using `GET /tasks`.
5. Confirm that the created task remains in the database.

Do not remove the Docker volume during this test.

## 📁 Project Structure

```text
W2_CRUD_API/
├── db/
│   ├── pool.js
│   └── schema.sql
├── repositories/
│   └── postgresTaskRepository.js
├── server.js
├── db.js
├── supabase.js
├── Dockerfile
├── compose.yaml
├── openapi.json
├── .dockerignore
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The `.env` file contains local configuration and is excluded from Git. The `node_modules/` directory is also excluded from version control.

## 🐳 Docker Architecture

```text
Client / Swagger UI
        |
        v
Node.js + Express API
        |
        +---- Supabase Auth
        |
        v
PostgreSQL Repository
        |
        v
PostgreSQL Database
        |
        v
Docker Volume (taskdata)
```

Docker Compose manages the application and database services. Inside the Compose network, the application connects to PostgreSQL using the database service hostname configured in `compose.yaml`.

Supabase handles user authentication, while PostgreSQL stores the application's task data.

## 🔄 Development Stages

### Stage 1 — Express CRUD API
Implemented task management endpoints, input validation, and HTTP status codes.

### Stage 2 — SQLite Storage
Introduced persistent SQLite storage and database-backed CRUD operations.

### Stage 3 — PostgreSQL Migration
Migrated task storage to PostgreSQL and added a repository layer and SQL initialization.

### Stage 4 — Docker Containerization
Added Dockerfile, Docker Compose, environment configuration, health checks, and persistent database storage.

### Stage 5 — Supabase Authentication
Added user registration, login, token verification, reusable authentication middleware, protected routes, and logout.

### Stage 6 — API Documentation and Testing
Updated the OpenAPI specification, configured Bearer authentication in Swagger UI, and tested the public, protected, and task endpoints.

## 🔐 Security Notes

- Keep `.env` out of Git.
- Use placeholders in `.env.example`.
- Never publish access tokens, refresh tokens, passwords, or private keys.
- Use only the appropriate Supabase publishable/anon key for this application configuration; never expose a Supabase service-role secret.
- Validate authentication on the server rather than relying on the Swagger UI.

## 🎯 Conclusion

This project demonstrates the development of a REST API with Express, persistent PostgreSQL storage, Docker containerization, and Supabase authentication.

It combines CRUD functionality with public and protected endpoints, reusable token verification middleware, and interactive Swagger documentation.

**GitHub repository:** [AminaHeljaa/W2_CRUD_API](https://github.com/AminaHeljaa/W2_CRUD_API)
