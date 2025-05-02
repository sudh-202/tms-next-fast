# TMS Frontend

This is the frontend for the Task Management System (TMS) built with Next.js.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── app/                   # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # Shared components
│   │   ├── ui/            # UI components
│   │   ├── tasks/         # Task-related components
│   │   ├── projects/      # Project-related components
│   │   └── notifications/ # Notification components
│   ├── ...                # Page routes
├── public/                # Static assets
├── styles/                # Global styles
├── next.config.js         # Next.js configuration
├── package.json           # Project metadata and dependencies
└── tsconfig.json          # TypeScript configuration
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Features

- Modern React with Next.js
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- Task management interface with kanban-like status tracking
- Project organization with custom icons and status tracking
- Real-time notifications for task and project activities
- Status filters and sorting options

## Connecting to the Backend

The frontend is configured to connect to the FastAPI backend running on port 8000. Make sure the backend is running before using the application.

## Testing

```bash
# Run tests
npm test
```

## Linting

```bash
# Run linter
npm run lint
```
