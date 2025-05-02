# Task Management System (TMS)

A full-stack task management application with a Next.js frontend and FastAPI backend.

![NextJS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next-dot-js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Project Overview

TMS is a task management system with the following features:

- Create, view, edit, and delete tasks
- Organize tasks into projects
- Track task status and due dates
- Notifications system for task and project activities
- Multiple status options for tasks (TODO, IN_PROGRESS, REVIEW, DONE)
- Project status tracking (PLANNING, ACTIVE, COMPLETED, ON_HOLD)
- Task completion tracking
- Custom project icons
- Responsive UI for desktop and mobile
- Local development with SQLite
- Production deployment with PostgreSQL

## Repository Structure

```
tms/
├── backend/             # FastAPI backend
│   ├── database.py      # Database connection
│   ├── models.py        # Database models (Tasks, Projects, Notifications)
│   ├── main.py          # API routes and app setup
│   └── requirements.txt # Python dependencies
│
├── frontend/            # Next.js frontend
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   └── package.json     # Node.js dependencies
│
├── docs/                # Documentation
└── render.yaml          # Render.com deployment configuration
```

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create a virtual environment:

   ```
   python -m venv venv
   ```

3. Activate the virtual environment:

   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

5. Run the backend:
   ```
   uvicorn main:app --reload
   ```

The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## Deployment

This project is configured for easy deployment to Render.com. See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions.

## Database Configuration

The application is configured to use:

- SQLite for local development
- PostgreSQL for production deployment on Render.com

The database connection is automatically handled based on the environment.

## API Documentation

Once the backend is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

[MIT](LICENSE)
