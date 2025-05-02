# TMS Backend

This is the FastAPI backend for the TMS (Task Management System) application.

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

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

## Current API Endpoints

The backend currently provides the following API endpoints:

- `GET /` - Root endpoint that returns a welcome message
- `GET /api/health` - Health check endpoint

## Future Development

To expand the backend, you'll need to:

1. Create database models
2. Set up database connection
3. Implement task-related endpoints
4. Implement authentication

We plan to add the following endpoints in the future:

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
