# 🚀 W2_CRUD_API - Task Management REST API

This project implements a simple yet robust RESTful API for managing tasks, built with Node.js and Express. It provides full CRUD (Create, Read, Update, Delete) operations for tasks, utilizing an in-memory data store for simplicity and demonstration purposes. The API is enhanced with input validation, proper HTTP status codes, and interactive documentation via Swagger UI.

## Badges

[![JavaScript](https://img.shields.io/badge/javascript-%23FFDE57.svg?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Swagger](https://img.shields.io/badge/swagger-%2385EA9B.svg?style=for-the-badge&logo=swagger&logoColor=white)](https://swagger.io/)

---

## ✨ Features

*   **RESTful API:** Built using the Express.js framework.
*   **CRUD Operations:** Full support for creating, reading, updating, and deleting tasks.
*   **In-Memory Storage:** Tasks are stored in memory, making it simple to run without external databases.
*   **Input Validation:** Ensures task titles are valid before creation or update.
*   **HTTP Status Codes:** Employs standard HTTP status codes for clear API responses (e.g., 200 OK, 201 Created, 404 Not Found, 400 Bad Request).
*   **Swagger UI Documentation:** Interactive API documentation is automatically generated and accessible via a dedicated endpoint.
*   **OpenAPI Specification:** Includes an OpenAPI specification for defining and describing the API.
*   **Git & GitHub:** Version controlled using Git and hosted on GitHub.

---

## 🛠️ Technologies Used

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| 🟨 JavaScript  | Programming Language             |
| 🟢 Node.js     | Runtime Environment              |
| 🚂 Express.js  | Web Framework                    |
| 📖 Swagger UI  | Interactive API Documentation    |
| 📋 OpenAPI     | API Specification Format         |
| 🔧 Git         | Version Control                  |
| 🐙 GitHub      | Code Hosting                     |

---

## 📦 Installation

To get started with this project, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AminaHeljaa/W2_CRUD_API.git
    cd W2_CRUD_API
    ```

2.  **Install dependencies:**
    This project uses npm for package management. Navigate to the project directory and run:
    ```bash
    npm install
    ```

---

## ▶️ Running the API

Once the dependencies are installed, you can start the API server:

```bash
node server.js
```

The server will be accessible at `http://localhost:3000`. You should see the following message in your console:

```text
Server running on http://localhost:3000
```

---

## 📖 Swagger UI Documentation

Interactive API documentation is available through Swagger UI. You can access it by navigating to:

`http://localhost:3000/docs`

This interface allows you to explore all available API endpoints and test them directly from your browser.

![Swagger UI Screenshot](swagger.png)

---

## 🔗 API Endpoints

The API supports the following endpoints:

| Method    | Endpoint     | Description                     |
| --------- | ------------ | ------------------------------- |
| 🟢 GET    | `/`          | Returns API information         |
| 🟢 GET    | `/health`    | Checks if the server is running |
| 🔵 GET    | `/tasks`     | Returns all tasks               |
| 🔵 GET    | `/tasks/:id` | Returns one task by ID          |
| 🟡 POST   | `/tasks`     | Creates a new task              |
| 🟠 PUT    | `/tasks/:id` | Updates an existing task by ID  |
| 🔴 DELETE | `/tasks/:id` | Deletes a task by ID            |

---

## 📝 Task Structure

Each task object follows this JSON structure:

```json
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": false
}
```

| Property | Type    | Description                             |
| -------- | ------- | --------------------------------------- |
| `id`     | Number  | Unique identifier for the task.         |
| `title`  | String  | The main content or title of the task.  |
| `done`   | Boolean | Indicates if the task has been completed. |

---

## 🔄 CRUD Operations Examples

### 1. GET `/` - API Information

*   **Request:** `GET /`
*   **Response:**
    ```json
    {
      "name": "Task API",
      "version": "1.0",
      "endpoints": ["/tasks"]
    }
    ```

### 2. GET `/health` - Health Check

*   **Request:** `GET /health`
*   **Response:**
    ```json
    {
      "status": "ok"
    }
    ```

### 3. GET `/tasks` - Get All Tasks

*   **Request:** `GET /tasks`
*   **Example Response:**
    ```json
    [
      {
        "id": 1,
        "title": "Learn REST APIs",
        "done": false
      }
    ]
    ```

### 4. GET `/tasks/:id` - Get Single Task

*   **Request:** `GET /tasks/1`
*   **Response (if found):**
    ```json
    {
      "id": 1,
      "title": "Learn REST APIs",
      "done": false
    }
    ```
*   **Response (if not found):** `404 Not Found` with `{"error": "Task 99 not found"}`

### 5. POST `/tasks` - Create a Task

*   **Request:** `POST /tasks`
*   **Request Body:**
    ```json
    {
      "title": "Buy milk"
    }
    ```
*   **Response (Success):** `201 Created` with the created task object (e.g., `{"id": 4, "title": "Buy milk", "done": false}`)
*   **Response (Validation Error):** `400 Bad Request` with `{"error": "Title must be between 3 and 120 characters."}` (Note: The code implements a check for empty/whitespace-only titles, the README mentions a character length constraint not explicitly in the code snippet).

*   **Example using curl:**
    ```bash
    curl -i -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Buy milk"}'
    ```

### 6. PUT `/tasks/:id` - Update a Task

*   **Request:** `PUT /tasks/1`
*   **Request Body:**
    ```json
    {
      "title": "Learn Express",
      "done": true
    }
    ```
*   **Response (if found):** `200 OK` with the updated task object.
*   **Response (if not found):** `404 Not Found` with `{"error": "Task 99 not found"}`

### 7. DELETE `/tasks/:id` - Delete a Task

*   **Request:** `DELETE /tasks/1`
*   **Response (if found):** `204 No Content` (empty body).
*   **Response (if not found):** `404 Not Found` with `{"error": "Task 99 not found"}`

---

## 📊 HTTP Status Codes Summary

| Code | Meaning      | Description                       |
| ---- | ------------ | --------------------------------- |
| 🟢 `200` | OK           | Successful GET or PUT request.    |
| 🟢 `201` | Created      | Successful POST request.          |
| 🟢 `204` | No Content   | Successful DELETE request.        |
| 🟡 `400` | Bad Request  | Invalid input or request data.    |
| 🔴 `404` | Not Found    | Requested resource does not exist. |

---

## 💾 Data Storage (In-Memory)

This API utilizes an **in-memory array** to store task data. This approach is simple and requires no external database setup.

**Example Data Structure:**

```javascript
let tasks = [
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
];
```

**Important Consideration:** As the data is stored only in memory, **all changes (creations, updates, deletions) will be lost when the server restarts.** This is an intentional design choice for this assignment.

---

## 🧪 Testing Approach

Manual testing was performed using:

*   **Command Line:** PowerShell/HTTP requests.
*   **Browser:** For accessing the API directly.
*   **Swagger UI:** For interactive testing of all endpoints.

The testing covered the complete CRUD cycle and verification of HTTP status codes for various scenarios (success, not found, bad request).

---

## 📁 Project Structure

The project follows a straightforward structure:

```text
W2_CRUD_API/
│
├── 📄 server.js         # Main application entry point
├── 📄 openapi.json      # OpenAPI specification file
├── 📄 package.json      # Project metadata and dependencies
├── 📄 package-lock.json # Lock file for dependency versions
├── 📄 README.md         # Project documentation
├── 🖼️ swagger.png       # Screenshot of Swagger UI
└── 📄 .gitignore        # Specifies intentionally untracked files

# (node_modules/ directory is excluded by .gitignore)
```

---

## 🪜 Development Stages

The project was developed incrementally through several stages:

*   **Stage 0 - Hello Server:** Initial Express server setup.
*   **Stage 1 - Root and Health Endpoints:** Added `/` and `/health` endpoints.
*   **Stage 2 - Read Endpoints:** Implemented `GET /tasks` and `GET /tasks/:id`, including 404 handling.
*   **Stage 3 - Create:** Added `POST /tasks` with task creation, auto-ID generation, and validation.
*   **Stage 4 - Full CRUD:** Implemented `PUT /tasks/:id` and `DELETE /tasks/:id`.
*   **Stage 5 - Swagger UI:** Integrated Swagger UI and OpenAPI for documentation and testing.
*   **Stage 6 - GitHub and Documentation:** Finalized documentation, pushed to GitHub, and added project-level documentation.

---

## 👩‍💻 Author

*   **Amina Helja**

This project was built as part of the **W2 A1 — Build your first CRUD API** assignment.

---

## 🔗 Repository

*   **URL:** [https://github.com/AminaHeljaa/W2_CRUD_API](https://github.com/AminaHeljaa/W2_CRUD_API)

---

## 📝 Contributing

Contributions are welcome! Please feel free to fork the repository, make your improvements, and submit a pull request. You can also open an issue if you find any bugs or have suggestions.

---

## 📄 License

This project is not explicitly licensed. For detailed information, please refer to the repository.
