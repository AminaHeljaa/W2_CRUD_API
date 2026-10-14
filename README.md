# 🚀 W2 CRUD API — Containerized Task API with PostgreSQL

A simple REST API built with Node.js and Express for managing a to-do list.

This project implements the complete CRUD cycle:

**Create → Read → Update → Delete**

The application uses PostgreSQL for persistent task storage and Docker Compose to run the API and database together. The API endpoints remain the same, while the database layer has been updated to use PostgreSQL instead of SQLite.

## ✨ Features

- ✅ REST API built with Express
- ✅ Create, read, update, and delete tasks
- ✅ Read all tasks or a single task
- ✅ Input validation
- ✅ Proper HTTP status codes
- ✅ Swagger UI documentation
- ✅ OpenAPI specification
- ✅ PostgreSQL database
- ✅ SQL-based CRUD operations
- ✅ Automatic database initialization
- ✅ Automatic table creation
- ✅ Dockerized Node.js application
- ✅ Docker Compose for the application and database
- ✅ Persistent database storage using a Docker volume
- ✅ Environment variables for database configuration
- ✅ `.env.example` for configuration reference
- ✅ Git and GitHub version control

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| JavaScript | Programming language |
| Node.js | JavaScript runtime |
| Express | Web framework |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL client for Node.js |
| `dotenv` | Environment variable configuration |
| Docker | Application containerization |
| Docker Compose | Running the application and database together |
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

### Clone the repository

```bash
git clone https://github.com/AminaHeljaa/W2_CRUD_API.git
cd W2_CRUD_API
```

### Configure environment variables

Create your local `.env` file using `.env.example` as a reference.

Example configuration:

```env
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=tasks
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tasks
```

Replace `your_password` with your own PostgreSQL password.

**Important:** The `.env` file contains local configuration and credentials. It should not be committed to Git. The `.env.example` file contains example values for other developers.

## 🐳 Running with Docker Compose

Make sure Docker Desktop is running.

Build the application image and start the application and database:

```bash
docker compose up --build -d
```

This command:

- Builds the Node.js application image.
- Starts the PostgreSQL database.
- Starts the Express API.
- Creates the Docker network used by both services.
- Creates a persistent Docker volume for PostgreSQL data.

Check the container status:

```bash
docker compose ps
```

The application should be available at:

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs
- PostgreSQL: `localhost:5432`

The database should report a healthy status when its health check succeeds.

### View application logs

```bash
docker compose logs app
```

To view database logs:

```bash
docker compose logs db
```

### Stop the application

```bash
docker compose down
```

This stops and removes the containers and network but preserves the database volume.

To start the application again:

```bash
docker compose up -d
```

**Do not use `docker compose down -v` if you want to keep the stored tasks.** The `-v` option removes the Compose-managed volumes.

## 🗄️ Database

The application uses PostgreSQL instead of SQLite.

The database configuration is stored in environment variables, and the application connects to PostgreSQL through the `pg` library.

The database name is:

```text
tasks
```

The database schema is defined in:

```text
db/schema.sql
```

The initialization script creates the `tasks` table and inserts the example tasks when the database is initialized for the first time.

The table contains the following columns:

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Unique task identifier |
| `title` | Text | Task title |
| `done` | Boolean | Indicates whether the task is completed |

Example task:

```json
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": false
}
```

### Persistent storage

PostgreSQL data is stored in a Docker volume named `taskdata`.

The volume is mounted at `/var/lib/postgresql` in the PostgreSQL 18 container.

This allows task data to survive container restarts and container recreation, as long as the volume is preserved.

The application uses a PostgreSQL repository to perform database operations. This separates the database logic from the API routes and makes the storage layer easier to maintain.

## 📖 Swagger UI

Interactive API documentation is available at:

http://localhost:3000/docs

Swagger UI allows you to test the API endpoints directly from your browser using the **Try it out** button.

The API documentation is based on the OpenAPI specification.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns API information |
| GET | `/health` | Checks whether the server is running |
| GET | `/tasks` | Returns all tasks |
| GET | `/tasks/:id` | Returns a single task |
| POST | `/tasks` | Creates a new task |
| PUT | `/tasks/:id` | Updates an existing task |
| DELETE | `/tasks/:id` | Deletes a task |

## 🔄 CRUD Operations

### 1. Get API information

**Request**

```http
GET /
```

Returns information about the API and its available endpoints.

### 2. Health check

**Request**

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

Status: `200 OK`

### 3. Get all tasks

**Request**

```http
GET /tasks
```

Returns all tasks stored in PostgreSQL.

Example response:

```json
[
  {
    "id": 1,
    "title": "Learn REST APIs",
    "done": false
  },
  {
    "id": 2,
    "title": "Build CRUD API",
    "done": false
  },
  {
    "id": 3,
    "title": "Test API endpoints",
    "done": true
  }
]
```

Status: `200 OK`

### 4. Get a single task

**Request**

```http
GET /tasks/1
```

Returns the task with ID `1`.

If the task does not exist, the API returns `404 Not Found`.

### 5. Create a task

**Request**

```http
POST /tasks
```

Request body:

```json
{
  "title": "Buy milk"
}
```

The API validates the title, creates the task, assigns an ID, and sets `done` to `false` by default.

Successful response: `201 Created`

An empty or missing title returns `400 Bad Request`.

### 6. Update a task

**Request**

```http
PUT /tasks/1
```

Request body:

```json
{
  "title": "Learn Express",
  "done": true
}
```

The API updates the task in PostgreSQL.

Successful response: `200 OK`

If the task does not exist, the API returns `404 Not Found`.

### 7. Delete a task

**Request**

```http
DELETE /tasks/1
```

Deletes the specified task.

Successful response: `204 No Content`

If the task does not exist, the API returns `404 Not Found`.

## 📊 HTTP Status Codes

| Status Code | Meaning | Usage |
|---|---|---|
| `200` | OK | Successful GET or PUT |
| `201` | Created | Task successfully created |
| `204` | No Content | Task successfully deleted |
| `400` | Bad Request | Invalid input |
| `404` | Not Found | Task does not exist |

## 🧪 Testing the API

The API can be tested using:

- PowerShell and HTTP requests
- A web browser
- Swagger UI
- Docker Compose logs
- PostgreSQL queries

Example PowerShell requests:

Check the API:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Get all tasks:

```powershell
Invoke-RestMethod http://localhost:3000/tasks
```

Create a task:

```powershell
$body = @{
    title = "Docker persistence test"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri http://localhost:3000/tasks `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Testing database persistence

Database persistence can be tested by creating a task and restarting the containers.

1. Create a task using `POST /tasks`.
2. Run `docker compose down`.
3. Start the application again with `docker compose up -d`.
4. Run `Invoke-RestMethod http://localhost:3000/tasks`.
5. Confirm that the previously created task is still present.

Do not add `-v` to the `docker compose down` command, because that would remove the Compose-managed volume.

The persistence test confirms that database records are stored outside the application container and remain available when the containers are recreated.

## 📁 Project Structure

```text
W2_CRUD_API/
│
├── db/
│   ├── pool.js
│   └── schema.sql
│
├── repositories/
│   └── postgresTaskRepository.js
│
├── server.js
├── db.js
├── Dockerfile
├── compose.yaml
├── .dockerignore
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The `.env` file is used for local configuration and is excluded from Git. The `node_modules/` directory is also excluded from Git and is not copied into the Docker image when excluded by `.dockerignore`.

## 🐳 Docker Architecture

The application uses two services:

**App service**
- Runs the Node.js and Express API.
- Exposes port `3000`.
- Connects to PostgreSQL using the Docker service hostname `db`.

**Database service**
- Runs PostgreSQL 18.
- Exposes port `5432` for local database access.
- Uses the `taskdata` Docker volume for persistent storage.
- Initializes the database using `db/schema.sql`.

Architecture:

```text
Client / Browser
       |
       v
Express REST API
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

Docker Compose manages the services and their shared network. Within the Docker network, the application connects to the database using the hostname `db`, rather than `localhost`.

## 🔄 Development Stages

### Stage 1 — Express REST API

Created the Node.js and Express API with task CRUD endpoints, validation, HTTP status codes, and API documentation.

### Stage 2 — SQLite Database

Replaced the in-memory task list with SQLite storage. Implemented SQL-based CRUD operations and automatic database and table creation.

### Stage 3 — PostgreSQL Migration

Replaced SQLite with PostgreSQL while keeping the API endpoints and client-facing behavior consistent.

Added:
- PostgreSQL connection pool.
- PostgreSQL task repository.
- SQL schema initialization.
- Environment-based database configuration.

### Stage 4 — Docker Containerization

Added:
- `Dockerfile` for the application.
- `compose.yaml` for the application and PostgreSQL services.
- `.dockerignore` to exclude unnecessary files from the build context.
- Persistent Docker volume for database storage.
- Health check for the PostgreSQL service.

### Stage 5 — Testing and GitHub

Built and started the Docker containers, checked the health of the database, tested API requests, and verified task persistence after restarting the containers.

The updated project was committed and pushed to GitHub.

## ✅ Assignment Requirements

- ✅ Existing CRUD API endpoints maintained.
- ✅ PostgreSQL used for task storage.
- ✅ SQL-based CRUD operations implemented.
- ✅ Database schema initialization configured.
- ✅ Environment variables used for database configuration.
- ✅ `.env.example` provided.
- ✅ Sensitive `.env` file excluded from Git tracking.
- ✅ Application containerized with Docker.
- ✅ Docker Compose configured for the application and database.
- ✅ PostgreSQL data persisted using a Docker volume.
- ✅ Application and database containers started successfully.
- ✅ Database health check passed.
- ✅ API requests tested.
- ✅ Changes pushed to GitHub.

## 🎯 Conclusion

This project demonstrates how to build a REST API with Express, connect it to a relational database, and run the complete application stack using Docker Compose.

The storage layer was migrated from SQLite to PostgreSQL while maintaining the existing API endpoints.

Containerization makes the application easier to run in a consistent environment, while the PostgreSQL Docker volume ensures that task data can persist independently of the application containers.

The final architecture separates the API, repository, database, and infrastructure configuration, providing a foundation for further development and deployment.

**GitHub repository:** https://github.com/AminaHeljaa/W2_CRUD_API
