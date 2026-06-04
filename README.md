# TaskFlow — REST API with Auth & Role-Based Access

A full-stack web application with a Node.js/Express backend, MongoDB database, JWT authentication, role-based access control, and a React frontend.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Swagger  
**Frontend:** React (Vite), React Router, Axios

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection, Swagger config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth guard, error handler
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/v1/      # Versioned API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # JWT helpers, response helpers
│   │   ├── validators/     # express-validator rules
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client + API calls
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context (global state)
│   │   ├── pages/          # Register, Login, Dashboard, Admin
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── SCALABILITY.md
```

---

## Prerequisites

- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas connection string

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/preeti9717/taskflow.git
cd taskflow
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:5000`  
Swagger docs will be at `http://localhost:5000/api-docs`

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

The default `.env` points to `http://localhost:5000/api/v1` — no changes needed for local development.

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:3000`

---

## API Endpoints

All routes are versioned under `/api/v1/`.

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register a new user |
| POST | `/api/v1/auth/login` | Public | Login and receive JWT |
| GET | `/api/v1/auth/profile` | Auth | Get current user profile |

### Tasks

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/tasks` | Auth | Get tasks (own for users, all for admins) |
| POST | `/api/v1/tasks` | Auth | Create a new task |
| GET | `/api/v1/tasks/:id` | Auth | Get a single task |
| PUT | `/api/v1/tasks/:id` | Auth | Update a task |
| DELETE | `/api/v1/tasks/:id` | Auth | Delete a task |

Query params for `GET /tasks`: `?status=todo|in-progress|done` and `?priority=low|medium|high`

### Admin

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/admin/users` | Admin | List all users |
| DELETE | `/api/v1/admin/users/:id` | Admin | Delete a user and their tasks |

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned on login and registration.

---

## Roles

| Role | Permissions |
|------|-------------|
| `user` | CRUD on own tasks only |
| `admin` | CRUD on all tasks + user management |

To create an admin account, set `"role": "admin"` in the registration request body (or use the UI dropdown).

---

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:5000/api-docs
```

Click **Authorize** (top right), paste your JWT token as `Bearer <token>`, and test all endpoints directly from the browser.

---

## Running Both Servers

Open two terminal windows:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```
