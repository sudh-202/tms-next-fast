# TMS Backend

This is the FastAPI backend for the TMS (Task Management System) application.

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-CC2927?style=for-the-badge&logo=sqlite&logoColor=white)

## Setup

1. Create a virtual environment:

```
python -m venv venv
```

2. Activate the virtual environment:

```
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:

```
pip install -r requirements.txt
```

4. Run the server:

```
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

API documentation will be available at:

- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Data Models

The backend implements the following data models:

### Task

- Properties: id, title, description, status, dueDate, completed, projectId
- Status values: TODO, IN_PROGRESS, REVIEW, DONE

### Project

- Properties: id, title, description, dueDate, status, icon
- Status values: PLANNING, ACTIVE, COMPLETED, ON_HOLD

### Notification

- Properties: id, title, message, type, read, taskId, projectId
- Type values: INFO, WARNING, SUCCESS, ERROR

## Current API Endpoints

The backend provides the following API endpoints:

- `GET /` - Root endpoint that returns a welcome message
- `GET /api/health` - Health check endpoint

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/{id}` - Get a specific project
- `PUT /api/projects/{id}` - Update a project
- `DELETE /api/projects/{id}` - Delete a project

### Notifications

- `GET /api/notifications` - Get notifications with options for limit and read status
- `POST /api/notifications` - Create a new notification
- `PUT /api/notifications/{id}/read` - Mark a specific notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

## Automatic Notifications

The backend automatically generates notifications for various events:

- Task creation
- Task status changes
- Task completion
- Task deletion
- Project creation
- Project status changes
- Project deletion
