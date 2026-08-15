# 🚀 W2 A1 — Task CRUD API

A simple REST API built with **Node.js** and **Express** for managing a to-do list.

This project implements the complete **CRUD** cycle:

> **Create → Read → Update → Delete**

The API uses an **in-memory** list of tasks, so no database is used.

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

## 📦 Installation

Clone the repository and open the project folder.

Install all required dependencies:

```bash
npm install
````

---

## ▶️ Running the API

Start the server with:

```bash
node server.js
```

The server will start at:

```text
http://localhost:3000
```

You should see:

```text
Server running on http://localhost:3000
```

---

## 📖 Swagger UI

The API has interactive Swagger documentation.

Open:

```text
http://localhost:3000/docs
```

Swagger UI allows you to test all API endpoints directly from the browser using the **Try it out** button.

### 📸 Swagger UI

![Swagger UI](swagger.png)

---

## 🔗 API Endpoints

| Method    | Endpoint     | Description                     |
| --------- | ------------ | ------------------------------- |
| 🟢 GET    | `/`          | Returns API information         |
| 🟢 GET    | `/health`    | Checks if the server is running |
| 🔵 GET    | `/tasks`     | Returns all tasks               |
| 🔵 GET    | `/tasks/:id` | Returns one task                |
| 🟡 POST   | `/tasks`     | Creates a new task              |
| 🟠 PUT    | `/tasks/:id` | Updates an existing task        |
| 🔴 DELETE | `/tasks/:id` | Deletes a task                  |

---

## 📝 Task Structure

Each task has the following structure:

```json
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": false
}
```

| Property | Type    | Description                             |
| -------- | ------- | --------------------------------------- |
| `id`     | Number  | Unique task ID                          |
| `title`  | String  | Task title                              |
| `done`   | Boolean | Indicates whether the task is completed |

---

# 🔄 CRUD Operations

## 🟢 1. GET — API Information

### Request

```http
GET /
```

### Response

```json
{
  "name": "Task API",
  "version": "1.0",
  "endpoints": [
    "/tasks"
  ]
}
```

**Status:** `200 OK`

---

## 💚 2. GET — Health Check

### Request

```http
GET /health
```

### Response

```json
{
  "status": "ok"
}
```

**Status:** `200 OK`

---

## 📋 3. GET — All Tasks

### Request

```http
GET /tasks
```

### Example Response

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

**Status:** `200 OK`

---

## 🔎 4. GET — Single Task

### Request

```http
GET /tasks/1
```

### Response

```json
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": false
}
```

**Status:** `200 OK`

### ❌ Task Not Found

Request:

```http
GET /tasks/99
```

Response:

```json
{
  "error": "Task 99 not found"
}
```

**Status:** `404 Not Found`

---

## ➕ 5. POST — Create a Task

### Request

```http
POST /tasks
```

### Request Body

```json
{
  "title": "Buy milk"
}
```

The server automatically:

* assigns the next available ID
* sets `done` to `false`
* adds the task to the in-memory list

### Response

```json
{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
```

**Status:** `201 Created`

### 💻 POST Example with curl

```bash
curl -i -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Buy milk"}'
```

Example result:

```text
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

---

## ⚠️ POST Validation

The API validates the task title.

An empty or missing title is not accepted.

### Invalid request

```json
{}
```

or:

```json
{
  "title": ""
}
```

### Response

```json
{
  "error": "Title must be between 3 and 120 characters."
}
```

**Status:** `400 Bad Request`

---

## ✏️ 6. PUT — Update a Task

### Request

```http
PUT /tasks/1
```

### Request Body

```json
{
  "title": "Learn Express",
  "done": true
}
```

### Response

```json
{
  "id": 1,
  "title": "Learn Express",
  "done": true
}
```

**Status:** `200 OK`

### ❌ Updating a Non-existing Task

Request:

```http
PUT /tasks/99
```

Response:

```json
{
  "error": "Task 99 not found"
}
```

**Status:** `404 Not Found`

---

## 🗑️ 7. DELETE — Delete a Task

### Request

```http
DELETE /tasks/1
```

If the task exists, it is removed from the list.

### Response

```text
204 No Content
```

The response body is empty.

### ❌ Deleting a Non-existing Task

Request:

```http
DELETE /tasks/99
```

Response:

```json
{
  "error": "Task 99 not found"
}
```

**Status:** `404 Not Found`

---

# 📊 HTTP Status Codes

| Status Code | Meaning     | Used for             |
| ----------- | ----------- | -------------------- |
| 🟢 `200`    | OK          | Successful GET / PUT |
| 🟢 `201`    | Created     | Successful POST      |
| 🟢 `204`    | No Content  | Successful DELETE    |
| 🟡 `400`    | Bad Request | Invalid input        |
| 🔴 `404`    | Not Found   | Task does not exist  |

---

# 💾 Data Storage

This project intentionally uses an **in-memory array** instead of a database.

Example:

```javascript
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
```

Because the data is stored only in memory:

> ⚠️ All newly created, updated, or deleted tasks are lost when the server is restarted.

This is intentional because the assignment requires an in-memory data store.

---

# 🧪 Testing

The API was tested using:

* 💻 PowerShell / HTTP requests
* 🌐 Browser
* 📖 Swagger UI

The complete CRUD cycle was tested:

```text
POST → Create
   ↓
GET → Read
   ↓
PUT → Update
   ↓
DELETE → Delete
```

The required status codes were also tested:

```text
201 → Created
200 → Successful request
204 → Deleted
400 → Invalid input
404 → Task not found
```

---

# 📁 Project Structure

```text
W2_CRUD_API/
│
├── 📄 server.js
├── 📄 openapi.json
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md
├── 🖼️ swagger.png
└── 📄 .gitignore
```

`node_modules` is excluded from Git using `.gitignore`.

---

# 🪜 Development Stages

## Stage 0 — Hello Server

Created the initial Express server and configured it to run on port 3000.

**Commit:**

```text
Stage 0: hello server
```

---

## Stage 1 — Root and Health Endpoints

Added:

```text
GET /
GET /health
```

**Commit:**

```text
Stage 1: root and health endpoints
```

---

## Stage 2 — Read Endpoints

Added:

```text
GET /tasks
GET /tasks/:id
```

Also added `404 Not Found` handling.

**Commit:**

```text
Stage 2: read endpoints with 404
```

---

## Stage 3 — Create

Added:

```text
POST /tasks
```

Implemented:

* task creation
* automatic ID
* validation
* `201 Created`
* `400 Bad Request`

**Commit:**

```text
Stage 3: create with validation
```

---

## Stage 4 — Full CRUD

Added:

```text
PUT /tasks/:id
DELETE /tasks/:id
```

Implemented:

* task updates
* task deletion
* `404 Not Found`
* `204 No Content`

**Commit:**

```text
Stage 4: full CRUD
```

---

## Stage 5 — Swagger UI

Added:

* Swagger UI
* OpenAPI specification
* `/docs` endpoint
* interactive API testing

Swagger is available at:

```text
http://localhost:3000/docs
```

**Commit:**

```text
Stage 5: Swagger UI
```

---

## Stage 6 — GitHub and Documentation

Added:

* README documentation
* Swagger screenshot
* GitHub repository
* project documentation

**Commit:**

```text
Stage 6: publish and docs
```

---

# 👩‍💻 Author

**Amina Helja**

Built as part of the **W2 A1 — Build your first CRUD API** assignment.


