# Deploying TMS to Render.com

This guide walks through deploying both the frontend and backend of the TMS application to Render.com using SQLite for data persistence.

## Option 1: Manual Deployment

### Step 1: Deploy the Backend

1. Create a new Render.com account or sign in at https://render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

   - **Name**: tms-backend
   - **Environment**: Python
   - **Region**: Choose nearest to your users
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

5. Add persistent disk storage:

   - Click "Advanced" to expand options
   - Enable "Persistent Disk"
   - Set "Mount Path" to `/data`
   - Set "Size" to 1 GB (free tier limit)

6. Add the following environment variables:

   - `RENDER`: false
   - `PYTHON_VERSION`: 3.10.0

7. Click "Create Web Service"

### Step 2: Create a PostgreSQL Database

1. Go to the Render dashboard and click "New +"
2. Select "PostgreSQL"
3. Configure the database:

   - **Name**: tms-db
   - **Database**: tms
   - **User**: tms_user
   - **Region**: Same as your web service
   - **Plan**: Free

4. Note the Internal Database URL - you'll need this for the backend

5. Go back to your backend web service settings
6. Add a new environment variable:
   - `DATABASE_URL`: [Internal Database URL from step 4]

### Step 3: Deploy the Frontend

1. In Render, click "New +" and select "Web Service"
2. Connect to the same GitHub repository
3. Configure the service:

   - **Name**: tms-frontend
   - **Environment**: Node
   - **Region**: Same as backend
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: Free

4. Add the environment variable:

   - `NEXT_PUBLIC_API_URL`: [Your backend service URL]
   - `NODE_VERSION`: 18.12.0

5. Click "Create Web Service"

## Option 2: Using render.yaml (Blueprint)

You can also deploy both services using the `render.yaml` file in this repository:

1. Fork or clone this repository
2. Go to Render.com and click "New +" then "Blueprint"
3. Connect to your repository
4. Render will automatically detect the `render.yaml` file and configure both services and the database
5. Review the configuration and click "Apply"

## Data Persistence

This application uses SQLite for data storage:

- The SQLite database is stored in a Render.com persistent disk volume mounted at `/data`
- The database will persist between deployments and service restarts
- Render's free tier includes 1GB of persistent storage, which is plenty for a task management app

## Verifying Deployment

1. Check your backend service is running by visiting:

   - `https://tms-backend.onrender.com/api/health`

2. Check your frontend is properly connected to the backend by logging in and using the task features

## Troubleshooting

- **Data Persistence Issues**: Make sure the persistent disk is properly configured
- **CORS Errors**: Ensure the frontend URL is added to the allowed origins in `main.py`
- **Deployment Failures**: Check the service logs in Render dashboard for specific errors
