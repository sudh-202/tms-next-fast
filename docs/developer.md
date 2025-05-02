# TMS Developer Documentation

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SQLAlchemy-CC2927?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLAlchemy" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [API Communication](#api-communication)
- [Authentication Flow](#authentication-flow)
- [Development Guidelines](#development-guidelines)
- [Deployment Instructions](#deployment-instructions)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Backend Deployment (Render)](#backend-deployment-render)
  - [Alternative Deployments](#alternative-deployments)

## Architecture Overview

TMS is structured as a full-stack application with:

- **Frontend**: A Next.js application providing the user interface and client-side logic
- **Backend**: A FastAPI application providing the API and server-side business logic
- **Database**: SQLite for development, can be configured for PostgreSQL/MySQL in production

```
┌───────────────┐     HTTP/HTTPS     ┌───────────────┐     SQL     ┌───────────────┐
│               │                    │               │             │               │
│  Next.js UI   │ ───────────────►   │  FastAPI API  │ ──────────► │   Database    │
│               │ ◄─────────────── │               │ ◄────────── │               │
└───────────────┘                    └───────────────┘             └───────────────┘
```

## Tech Stack

### Frontend

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API / React Query
- **API Communication**: Fetch API / Axios

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.9+
- **ORM**: SQLAlchemy
- **Schema Validation**: Pydantic
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger UI / ReDoc

## API Communication

The frontend communicates with the backend using RESTful API calls. Example:

```typescript
// Frontend API call example (TypeScript)
async function fetchTasks() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return await response.json();
}
```

```python
# Backend API endpoint example (Python)
@router.get("/api/tasks", response_model=List[TaskSchema])
async def get_tasks(current_user: User = Depends(get_current_user)):
    """Get all tasks for the current user."""
    return await task_service.get_tasks_by_user(current_user.id)
```

## Authentication Flow

1. User submits login credentials to `/api/auth/login`
2. Backend validates credentials and returns JWT token
3. Frontend stores token in local storage or secure cookie
4. Frontend includes token in Authorization header for subsequent requests
5. Backend validates token and provides access to resources

## Development Guidelines

### Code Style

- **Frontend**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Backend**: Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for new features
- `feature/*`: New features and improvements
- `bugfix/*`: Bug fixes

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add user authentication
fix: resolve task creation issue
docs: update deployment instructions
```

## Deployment Instructions

### Frontend Deployment (Vercel)

1. **Create a Vercel Account**: Sign up at [vercel.com](https://vercel.com)

2. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

3. **Configure Environment Variables**:

   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend

4. **Deploy to Vercel**:

   **Option 1: Direct from GitHub**

   - Connect your GitHub repository to Vercel
   - Configure the project settings (root directory: `frontend`)
   - Set environment variables
   - Deploy

   **Option 2: Using Vercel CLI**

   ```bash
   cd frontend
   vercel
   ```

5. **Custom Domain** (optional):
   - Configure custom domain in Vercel project settings

### Backend Deployment (Render)

1. **Create a Render Account**: Sign up at [render.com](https://render.com)

2. **Create a New Web Service**:

   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `tms-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Configure Environment Variables**:

   - `DATABASE_URL`: Your production database URL
   - `SECRET_KEY`: Secret key for JWT
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: URL of your frontend (e.g., `https://your-frontend-domain.com`)

4. **Deploy** by clicking the "Create Web Service" button

### Alternative Deployments

#### Docker Deployment

1. **Create a Dockerfile in the backend directory**:

   ```dockerfile
   FROM python:3.9

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Create a Docker Compose file in the root directory**:

   ```yaml
   version: "3"

   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://user:password@db:5432/tms
         - SECRET_KEY=your-secret-key
         - ENVIRONMENT=production
       depends_on:
         - db

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://localhost:8000

     db:
       image: postgres:14
       environment:
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=password
         - POSTGRES_DB=tms
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

#### AWS Deployment

1. **Backend**: Deploy the FastAPI application to AWS Elastic Beanstalk
2. **Frontend**: Deploy the Next.js application to AWS Amplify
3. **Database**: Use Amazon RDS for the database

#### Azure Deployment

1. **Backend**: Deploy to Azure App Service
2. **Frontend**: Deploy to Azure Static Web Apps
3. **Database**: Use Azure Database for PostgreSQL

## Monitoring and Logging

- Use Sentry for error tracking
- Configure logging with Python's built-in logging module in the backend
- Use Vercel Analytics for frontend performance monitoring

## CI/CD Integration

Set up GitHub Actions for continuous integration and deployment:

```yaml
# .github/workflows/frontend.yml for the Next.js frontend
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths:
      - "frontend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      - name: Build
        working-directory: ./frontend
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

```yaml
# .github/workflows/backend.yml for the FastAPI backend
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths:
      - "backend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: "3.9"
      - name: Install dependencies
        working-directory: ./backend
        run: pip install -r requirements.txt
      - name: Test
        working-directory: ./backend
        run: pytest
      - name: Deploy to Render
        uses: render-actions/deploy-to-render@v1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```
