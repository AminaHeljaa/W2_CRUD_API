# 🚀 W2 A1 — Task CRUD API


A simple REST API built with **Node.js** and **Express** for managing a to-do list.


This project implements the complete **CRUD** cycle:


> **Create → Read → Update → Delete**


The API uses an **in-memory** list of tasks, meaning that no database is used.


---


## ✨ Features


- ✅ REST API built with Express
- ✅ Create tasks
- ✅ Read all tasks
- ✅ Read a single task
- ✅ Update tasks
- ✅ Delete tasks
- ✅ Input validation
- ✅ Proper HTTP status codes
- ✅ Swagger UI documentation
- ✅ OpenAPI specification
- ✅ In-memory data storage
- ✅ Git and GitHub version control


---


## 🛠️ Technologies


| Technology | Purpose |
|---|---|
| 🟨 JavaScript | Programming language |
| 🟢 Node.js | Runtime environment |
| 🚂 Express | Web framework |
| 📖 Swagger UI | Interactive API documentation |
| 📋 OpenAPI | API specification |
| 🔧 Git | Version control |
| 🐙 GitHub | Code hosting |


---


# 📦 Installation


Clone the repository and open the project folder.


Install all required dependencies:


```bash
npm install
▶️ Running the API

Start the server with:

node server.js

The server will start at:

http://localhost:3000

You should see:

Server running on http://localhost:3000
📖 Swagger UI

The API has interactive Swagger documentation.

Open:

http://localhost:3000/docs

Swagger UI allows you to test all API endpoints directly from the browser using the Try it out button.

📸 Swagger UI

🔗 API Endpoints
Method	Endpoint	Description
🟢 GET	/	Returns API information
🟢 GET	/health	Checks if the server is running
🔵 GET	/tasks	Returns all tasks
🔵 GET	/tasks/:id	Returns one task
🟡 POST	/tasks	Creates a new task
🟠 PUT	/tasks/:id	Updates an existing task
🔴 DELETE	/tasks/:id	Deletes a task
📝 Task Structure

Each task has the following structure:

{
  "id": 1,
  "title": "Learn REST APIs",
  "done": false
}
Properties
Property	Type	Description
id	Number	Unique task ID
title	String	Task title
done	Boolean	Indicates whether the task is completed
🔄 CRUD Operations
🟢 1. GET — API Information
Request
GET /
Response
{
  "name": "Task API",
  "version": "1.0",
  "endpoints": [
    "/tasks"
  ]
}

Status: 200 OK

💚 2. GET — Health Check
Request
GET /health
Response
{
  "status": "ok"
}

Status: 200 OK

📋 3. GET — All Tasks
Request
GET /tasks
Example Response
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

Status: 200 OK

🔎 4. GET — Single Task
Request
GET /tasks/1
Response
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": false
}

Status: 200 OK

Task Not Found

Request:

GET /tasks/99

Response:

{
  "error": "Task 99 not found"
}

Status: 404 Not Found

➕ 5. POST — Create a Task
Request
POST /tasks
Request Body
{
  "title": "Buy milk"
}

The server automatically:

assigns the next available ID
sets done to false
adds the task to the in-memory list
Response
{
  "id": 4,
  "title": "Buy milk",
  "done": false
}

Status: 201 Created

💻 POST Example with curl
curl -i -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Buy milk"}'

Expected response:

HTTP/1.1 201 Created
⚠️ POST Validation

The API validates the task title.

An empty or missing title is not accepted.

Invalid request
{}

or:

{
  "title": ""
}
Response
{
  "error": "Title must be between 3 and 120 characters."
}

Status: 400 Bad Request

✏️ 6. PUT — Update a Task
Request
PUT /tasks/1
Request Body
{
  "title": "Learn Express",
  "done": true
}
Response
{
  "id": 1,
  "title": "Learn Express",
  "done": true
}

Status: 200 OK

❌ Updating a Non-existing Task

Request:

PUT /tasks/99

Response:

{
  "error": "Task 99 not found"
}

Status: 404 Not Found

🗑️ 7. DELETE — Delete a Task
Request
DELETE /tasks/1

If the task exists, it is removed from the list.

Response
204 No Content

The response body is empty.

❌ Deleting a Non-existing Task

Request:

DELETE /tasks/99

Response:

{
  "error": "Task 99 not found"
}

Status: 404 Not Found

📊 HTTP Status Codes
Status Code	Meaning	Used for
🟢 200	OK	Successful GET / PUT
🟢 201	Created	Successful POST
🟢 204	No Content	Successful DELETE
🟡 400	Bad Request	Invalid input
🔴 404	Not Found	Task does not exist
💾 Data Storage

This project intentionally uses an in-memory array instead of a database.

Example:

let tasks = [
    {
        id: 1,
        title: "Learn REST APIs",
        done: false
    },
    {
        id: 2,
        title: "Build CRUD API",
        done: false
    },
    {
        id: 3,
        title: "Test API endpoints",
        done: true
    }
];

Because the data is stored only in memory:

⚠️ All newly created, updated, or deleted tasks are lost when the server is restarted.

This is intentional because the assignment requires an in-memory data store.

🧪 Testing

The API was tested using:

💻 PowerShell / HTTP requests
🌐 Browser
📖 Swagger UI

The complete CRUD cycle was tested:

POST → Create
   ↓
GET → Read
   ↓
PUT → Update
   ↓
DELETE → Delete

The required status codes were also tested:

201 → Created
200 → Successful request
204 → Deleted
400 → Invalid input
404 → Task not found
📁 Project Structure
W2_CRUD_API/
│
├── 📄 server.js
├── 📄 openapi.json
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md
├── 🖼️ swagger.png
├── 📄 .gitignore
└── 📁 node_modules/

node_modules is excluded from Git using .gitignore.

🪜 Development Stages
Stage 0 — Hello Server

Created the initial Express server and configured it to run on port 3000.

Commit:

Stage 0: hello server
Stage 1 — Root and Health Endpoints

Added:

GET /
GET /health

Commit:

Stage 1: root and health endpoints
Stage 2 — Read Endpoints

Added:

GET /tasks
GET /tasks/:id

Also added 404 Not Found handling.

Commit:

Stage 2: read endpoints with 404
Stage 3 — Create

Added:

POST /tasks

Implemented:

task creation
automatic ID
validation
201 Created
400 Bad Request

Commit:

Stage 3: create with validation
Stage 4 — Full CRUD

Added:

PUT /tasks/:id
DELETE /tasks/:id

Implemented:

task updates
task deletion
404 Not Found
204 No Content

Commit:

Stage 4: full CRUD
Stage 5 — Swagger UI

Added:

Swagger UI
OpenAPI specification
/docs endpoint
interactive API testing

Swagger is available at:

http://localhost:3000/docs

Commit:

Stage 5: Swagger UI
Stage 6 — GitHub and Documentation

Added:

README documentation
Swagger screenshot
GitHub repository
project documentation

Commit:

Stage 6: publish and docs