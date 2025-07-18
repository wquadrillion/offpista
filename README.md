# Offpista Task Manager

A fullstack user task manager app with Node.js, Express, Supabase, React, and Tailwind CSS.

## Features
- User authentication (JWT, secure password hashing)
- User and task models (Supabase)
- RESTful API for user and task CRUD
- Insights endpoint for task status breakdown
- Input validation and error handling
- Modern UI with authentication, task list, insights, and form validation
- Extras field for tasks (JSON: tags, due date, priority)

## Setup Instructions

### Backend
1. Copy `.env.example` to `.env` and fill in your port, Supabase credentials and JWT secret.
2. Run the migration SQL in `backend/migrations/001_create_tables.sql` in your Supabase SQL editor.
3. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
4. Start the backend:
   ```sh
   npm start
   ```

### Frontend
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```sh
   npm start
   ```

### API Endpoints
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/tasks` — List tasks (auth required)
- `POST /api/tasks` — Create task (auth required)
- `PUT /api/tasks/:id` — Update task (auth required)
- `DELETE /api/tasks/:id` — Delete task (auth required)
- `GET /api/tasks/insights` — Task status summary (auth required)
- `GET /api/health` — Health check

### Database Schema
See `backend/migrations/001_create_tables.sql` for full schema.

### Dev Note: What I'd build next if I had more time
- User profile and password reset
- Task comments and attachments
- Real-time updates with Supabase subscriptions
- More granular RBAC and Supabase policies
- Production deployment (Vercel/Netlify + Fly.io/Render)

### Deployment
- Frontend: Deploy to Vercel, Netlify, or similar.
- Backend: Deploy to Fly.io, Render, or similar. Set environment variables for production.
