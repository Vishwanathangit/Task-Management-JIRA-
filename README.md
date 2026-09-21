# 📋 Task Management Platform

A Jira-style task management app with role-based workflow (PM, Scrum Master, Developer, Tester), task assignment, status lifecycle, comments, and audit history.

**Live Link:** [https://task-management-frontend-kappa-five.vercel.app](https://task-management-frontend-kappa-five.vercel.app)

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Design Patterns Used](#-design-patterns-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running Locally (without Docker)](#-running-locally-without-docker)
- [Running with Docker Compose](#-running-with-docker-compose)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Roles & Permissions](#-roles--permissions)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Development Notes](#-development-notes)
- [AI Assistant Usage](#-ai-assistant-usage)
- [License](#-license)

---

## 🎯 Features

- 🔐 **JWT Authentication via HttpOnly Cookies** — Secure, cross-site scripting (XSS) resistant authentication stored in httpOnly, SameSite=Lax cookies.
- 👥 **4-Role Role-Based Access Control (RBAC)** — Granular permissions for `PM`, `SCRUM_MASTER`, `DEVELOPER`, and `TESTER`.
- 📁 **Project CRUD** — Create, view, update, and soft-delete projects with assigned PMs.
- 📋 **Task CRUD with 6-Stage Lifecycle** — Manage tasks across `TODO`, `IN_PROGRESS`, `STAGING`, `PRODUCTION`, `COMPLETED`, and `CLOSED` states.
- 👤 **Task Assignment & Reassignment** — Assign tasks to team members with role-based assignment permissions.
- 💬 **Task Comments** — Threaded discussion on tasks to collaborate on requirements and updates.
- 📜 **Combined Activity Timeline** — Single timeline view combining detailed audit history (edits, status changes, assignments) and user comments.
- 🔍 **Server-Side Search** — Instant search matching task title, assignee, project title, and status.
- 🎚️ **Filters with URL Persistence & Chips** — Filter by status, project, and assignee with active filter chips, one-click clear, and full browser URL query string sync.
- 📅 **Date-Range Filtering** — Filter tasks created within a date range, with future dates disabled in the picker.
- ⏱️ **Debounced Search** — Optimized client-side search input preventing excessive backend queries.
- 📄 **Server-Side Pagination** — Fast response times using database-level offset pagination (`page`, `limit`, total count, page calculation).
- 🌓 **Dark / Light Theme** — Seamless theme toggle persisted in `localStorage`.
- 🐳 **Docker + Docker Compose Support** — Full containerization with a dedicated Dockerfile per app and local PostgreSQL container.
- ⚙️ **GitHub Actions CI/CD** — Automated workflow for linting, type-checking, testing, building, and publishing Docker images to GitHub Container Registry (GHCR).
- 🌱 **Demo Data Seed Script** — CLI seed script (`npm run seed`) to populate initial users, projects, tasks, comments, and audit history.

---

## ⚙️ Tech Stack

### Backend

| Dependency | Version | Purpose |
|---|---|---|
| express | ^5.2.1 | Core Web Framework |
| drizzle-orm | ^0.45.2 | PostgreSQL ORM |
| postgres | ^3.4.9 | Native PostgreSQL Driver |
| jsonwebtoken | ^9.0.3 | JWT Authentication |
| bcrypt | ^6.0.0 | Password Hashing |
| cookie-parser | ^1.4.7 | HttpOnly Cookie Parsing |
| zod | ^4.6.5 | Schema Validation |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| helmet | ^8.3.0 | Security Headers Middleware |
| morgan | ^1.12.1 | HTTP Request Logger |
| express-rate-limit | ^8.7.0 | Auth Endpoint Rate Limiting |
| dotenv | ^18.0.0 | Environment Variable Loader |

**Dev Dependencies**

| Dependency | Version | Purpose |
|---|---|---|
| typescript | ^6.0.3 | Type Checking & Compilation |
| vitest | ^5.0.1 | Unit & Integration Test Runner |
| supertest | ^7.2.2 | HTTP Assertion Library |
| drizzle-kit | ^0.31.10 | Schema Migrations & Management |
| tsx | ^4.23.13 | TypeScript Execution Engine |
| nodemon | ^3.1.14 | Development Server Reloader |
| eslint | ^8.57.1 | Linter |
| eslint-config-prettier | ^10.1.8 | Prettier ESLint Config |
| eslint-plugin-import | ^2.32.0 | ESLint Import Plugin |
| prettier | ^3.9.8 | Code Formatter |
| @typescript-eslint/eslint-plugin | ^8.70.0 | TypeScript ESLint Rules |
| @typescript-eslint/parser | ^8.70.0 | TypeScript Parser |
| @types/bcrypt | ^6.0.0 | Type Definitions for bcrypt |
| @types/cookie-parser | ^1.4.10 | Type Definitions for cookie-parser |
| @types/cors | ^2.8.19 | Type Definitions for cors |
| @types/express | ^5.0.6 | Type Definitions for express |
| @types/jsonwebtoken | ^9.0.10 | Type Definitions for jsonwebtoken |
| @types/morgan | ^1.9.10 | Type Definitions for morgan |
| @types/node | ^26.6.1 | Type Definitions for Node.js |
| @types/supertest | ^7.2.1 | Type Definitions for supertest |

### Frontend

| Dependency | Version | Purpose |
|---|---|---|
| react | ^19.2.8 | UI Framework |
| react-dom | ^19.2.8 | DOM Renderer |
| react-router-dom | ^7.18.4 | Client-Side Routing |
| axios | ^1.20.0 | HTTP Client |
| zustand | ^5.0.15 | Client State Management |
| react-hook-form | ^7.88.0 | Form Management |
| @hookform/resolvers | ^5.9.1 | Zod Form Validation Resolver |
| zod | ^4.6.5 | Shared Type & Form Validation |
| tailwindcss | ^4.3.3 | Utility-First CSS Framework |
| @tailwindcss/vite | ^4.3.3 | Tailwind CSS Vite Plugin |
| lucide-react | ^1.47.0 | UI Icon Set |
| date-fns | ^4.4.0 | Date Utility Library |
| react-day-picker | ^10.0.1 | Calendar & Date Selection UI |
| radix-ui | ^1.6.7 | Headless Accessible Primitives |
| shadcn | ^4.21.0 | Component Utilities |
| class-variance-authority | ^0.7.1 | Dynamic Style Variant Helper |
| clsx | ^2.1.1 | Class Name Utility |
| tailwind-merge | ^3.7.0 | Tailwind Class Merging |
| tw-animate-css | ^1.4.0 | CSS Animations for Tailwind |
| cn | ^0.3.0 | Classname Merger Helper |
| @fontsource-variable/geist | ^5.3.0 | Geist Font |

**Dev Dependencies**

| Dependency | Version | Purpose |
|---|---|---|
| vite | ^8.3.0 | Build Tool & Dev Server |
| typescript | ~6.0.2 | Type Checking |
| eslint | ^10.10.0 | Linter |
| @eslint/js | ^10.0.1 | ESLint Core JS Config |
| @vitejs/plugin-react | ^6.1.1 | React Plugin for Vite |
| eslint-plugin-react-hooks | ^7.1.1 | React Hooks ESLint Rules |
| eslint-plugin-react-refresh | ^0.5.6 | React Fast Refresh ESLint Rules |
| globals | ^17.12.0 | Global Identifier Definitions |
| typescript-eslint | ^8.69.0 | TypeScript ESLint Tooling |
| @types/node | ^24.13.6 | Type Definitions for Node.js |
| @types/react | ^19.2.18 | Type Definitions for React |
| @types/react-dom | ^19.2.7 | Type Definitions for React DOM |

### Tooling & Environment

| Tool / Environment | Version / Detail |
|---|---|
| Node.js | >= 20.0.0 |
| Package Manager | npm |
| IDE | Antigravity IDE |
| Host & Container Deployments | Vercel (Live App), Docker & GHCR (Container Builds) |

---

## 🧩 Design Patterns Used

| Pattern | Where | Why |
|---|---|---|
| **Singleton** | `backend/src/config/db.ts` | Reuses a single `postgres` connection client instance across the application lifecycle to prevent connection leaks and optimize connection pooling. |

---

## 📁 Project Structure

```text
Task Management/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── README.md
│
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.ts          # Vercel serverless entrypoint
│   │   ├── config/               # Database client (Singleton)
│   │   ├── constants/            # Roles, task status, task action enums
│   │   ├── controllers/          # Express request handlers
│   │   ├── middlewares/          # Auth, RBAC, error handling, rate limiting
│   │   ├── models/               # Drizzle ORM schemas & relations
│   │   ├── routes/               # Express route definitions
│   │   ├── services/             # Business logic layer
│   │   ├── types/                # TypeScript interfaces & types
│   │   ├── utils/                # Password hashing, JWT token helpers
│   │   ├── validators/           # Zod validation schemas
│   │   ├── scripts/              # Database seed script
│   │   ├── app.ts                # Express app configuration
│   │   └── server.ts             # Node server entrypoint (Local/Docker)
│   ├── drizzle/                  # SQL migration files
│   ├── .env.sample
│   ├── Dockerfile
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
└── frontend/
    ├── public/
    │   └── taskmanagementfavicon.png
    ├── src/
    │   ├── api/                  # Axios instance & API endpoints
    │   ├── components/
    │   │   ├── common/           # Filter chips, date picker, loading states
    │   │   ├── layout/           # Navbar, sidebar, shell layout
    │   │   └── ui/               # Buttons, dialogs, inputs, select controls
    │   ├── constants/            # Theme, status colors, navigation options
    │   ├── context/              # Theme & Auth context providers
    │   ├── hooks/                # Custom hooks (debouncing, search params)
    │   ├── lib/                  # Class utility helpers (`cn`)
    │   ├── pages/                # Task board, project overview, auth pages
    │   ├── routes/               # Protected & role-guarded route components
    │   ├── store/                # Zustand global stores
    │   ├── types/                # TypeScript interfaces
    │   ├── validators/           # Client-side Zod validation schemas
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── .env.sample
    ├── Dockerfile
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vercel.json               # API rewrite proxy for Vercel deployment
    └── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **PostgreSQL**: Local PostgreSQL instance OR a free [Supabase](https://supabase.com) PostgreSQL database
- **Docker & Docker Compose** (Optional, for containerized execution)

### Clone the Repository

```bash
git clone https://github.com/Vishwanathangit/Task-Management-JIRA-.git
cd Task-Management-JIRA-
```

---

## 💻 Running Locally (without Docker)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.sample .env
# Edit .env and supply your DATABASE_URL and JWT_SECRET

# Generate & apply migrations
npm run db:generate
npm run db:push

# (Optional) Populate database with demo data
npm run seed

# Start development server
npm run dev
```

*The backend server runs on `http://localhost:5000` by default.*

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.sample .env

# Start Vite development server
npm run dev
```

*The frontend application runs on `http://localhost:5173` by default.*

---

## 🐳 Running with Docker Compose

To start the full stack (backend, frontend, and a local PostgreSQL container) in one command:

```bash
docker compose up --build
```

- **Frontend**: Accessible at `http://localhost:5173`
- **Backend API**: Accessible at `http://localhost:5000`
- **PostgreSQL Database**: Port `5432` internally inside the container network

> **Note**: The local PostgreSQL container satisfies standalone container execution requirements. `DATABASE_URL` is automatically configured inside `docker-compose.yml` to point to the `postgres` service container.

---

## 🌍 Environment Variables

### Backend (`backend/.env.sample`)

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default: `5000`) |
| `NODE_ENV` | Application runtime environment (`development`, `production`, `test`) |
| `FRONTEND_URL` | Frontend origin URL used for CORS validation |
| `DATABASE_URL` | PostgreSQL connection string (Supabase or local PostgreSQL) |
| `JWT_SECRET` | Secret key used to sign and verify JWT authentication tokens |
| `JWT_EXPIRES_IN` | Token validity duration (e.g., `1d` for 1 day) |

### Frontend (`frontend/.env.sample`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base API URL prefix (`http://localhost:5000/api/v1` locally, `/api/v1` in production) |

---

## 📜 Scripts

### Backend (`backend/package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `nodemon --exec tsx src/server.ts` | Runs dev server with hot reload |
| `npm run build` | `tsc` | Compiles TypeScript into `dist/` |
| `npm run start` | `node dist/server.js` | Runs compiled production server |
| `npm run lint` | `eslint src/**/*.ts` | Runs ESLint analysis |
| `npm run test` | `vitest run` | Runs unit and integration test suite |
| `npm run test:watch` | `vitest` | Runs test runner in watch mode |
| `npm run db:generate` | `drizzle-kit generate` | Generates SQL migrations from schema |
| `npm run db:migrate` | `drizzle-kit migrate` | Applies SQL migrations to database |
| `npm run db:push` | `drizzle-kit push` | Applies schema changes directly to DB |
| `npm run db:studio` | `drizzle-kit studio` | Opens interactive Drizzle database GUI |
| `npm run seed` | `tsx src/scripts/seed.ts` | Seeds demo projects, tasks, and users |

### Frontend (`frontend/package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Starts Vite development server |
| `npm run build` | `tsc -b && vite build` | Type-checks and builds production bundle |
| `npm run lint` | `eslint .` | Runs ESLint across component files |
| `npm run preview` | `vite preview` | Previews production build locally |

---

## 🛡️ Roles & Permissions

| Role | Create Project | Create Task | Assign Task | Change Status | Delete (Soft) |
|---|:---:|:---:|:---:|:---:|:---:|
| **PM** | ✅ | ✅ | ✅ | ✅ | ✅ (Projects & Tasks) |
| **SCRUM_MASTER** | ❌ | ✅ | ✅ | ✅ | ✅ (Tasks only) |
| **DEVELOPER** | ❌ | ✅ | ❌ | ✅ | ❌ |
| **TESTER** | ❌ | ✅ | ❌ | ✅ | ❌ |

> **Notes on RBAC Implementation**:
> - **Create Task** (`POST /api/v1/task`): Allowed for `PM`, `SCRUM_MASTER`, `DEVELOPER`, and `TESTER`.
> - **Change Status** (`PATCH /api/v1/task/:id/status`): Open to **all authenticated roles** (`PM`, `SCRUM_MASTER`, `DEVELOPER`, `TESTER`).
> - **Assign Task** (`PATCH /api/v1/task/:id/assign`): Restricted to `PM` and `SCRUM_MASTER`.
> - **Delete Task** (`DELETE /api/v1/task/:id`): Restricted to `PM` and `SCRUM_MASTER`.
> - **Project Management** (`POST/PATCH/DELETE /api/v1/project`): Restricted to `PM`.

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/v1/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | Register a new user |
| `POST` | `/api/v1/auth/login` | Authenticate user & set HttpOnly JWT cookie |
| `POST` | `/api/v1/auth/logout` | Clear authentication cookie |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile |

### 👥 Users (`/api/v1/user`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/user` | List all system users |
| `GET` | `/api/v1/user/:id` | Get user details by ID |

### 📁 Projects (`/api/v1/project`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/project` | Create a new project (*PM*) |
| `GET` | `/api/v1/project` | List all active projects |
| `GET` | `/api/v1/project/:id` | Get project details by ID |
| `PATCH` | `/api/v1/project/:id` | Update project metadata (*PM*) |
| `DELETE` | `/api/v1/project/:id` | Soft delete a project (*PM*) |

### 📋 Tasks (`/api/v1/task`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/task` | Create task (*PM*, *SCRUM_MASTER*, *DEVELOPER*, *TESTER*) |
| `GET` | `/api/v1/task` | List tasks with search, filter, and pagination |
| `GET` | `/api/v1/task/:id` | Get task details by ID |
| `PATCH` | `/api/v1/task/:id` | Update task details |
| `PATCH` | `/api/v1/task/:id/status` | Change task lifecycle status (*All authenticated roles*) |
| `PATCH` | `/api/v1/task/:id/assign` | Reassign task (*PM*, *SCRUM_MASTER*) |
| `DELETE` | `/api/v1/task/:id` | Soft delete task (*PM*, *SCRUM_MASTER*) |

#### Task Query Parameters (`GET /api/v1/task`)

| Parameter | Type | Description |
|---|---|---|
| `search` | `string` | Search substring matching title, assignee name, project title, or status |
| `status` | `string` | Lifecycle status filter (`TODO`, `IN_PROGRESS`, `STAGING`, `PRODUCTION`, `COMPLETED`, `CLOSED`) |
| `projectId` | `string` | Filter tasks by target project UUID |
| `assignedTo` | `string` | Filter tasks by assigned user UUID |
| `fromDate` | `string` | Start date filter (ISO format) |
| `toDate` | `string` | End date filter (ISO format) |
| `page` | `number` | Page number for server-side pagination (default: `1`) |
| `limit` | `number` | Page size (default: `10`) |

### 💬 Comments & Activity (`/api/v1/task/:id`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/task/:id/comments` | Add comment to task |
| `GET` | `/api/v1/task/:id/comments` | List comments for task |
| `GET` | `/api/v1/task/:id/history` | Fetch audit trail history for task |
| `GET` | `/api/v1/task/:id/timeline` | Fetch combined activity timeline (history + comments) |

---

## ☁️ Deployment

### 1. Docker & CI/CD Pipeline

- **GitHub Actions Workflow** (`.github/workflows/ci.yml`):
  - Triggers on all Pull Requests and merges to `main`.
  - Runs linting (`npm run lint`), TypeScript type-checks (`npx tsc --noEmit`), automated tests (`npm run test`), and build verification for both backend and frontend applications.
  - On merge to `main`, automatically builds Docker images and pushes them to GitHub Container Registry (GHCR):
    - `ghcr.io/<owner>/task-management-backend:latest`
    - `ghcr.io/<owner>/task-management-frontend:latest`

### 2. Live Vercel Deployment

The application is deployed live as **two separate Vercel projects** (Frontend & Backend):

- **Backend Vercel Deployment**:
  - Serves Express API via serverless handler entrypoint (`backend/src/api/index.ts`).
  - Required Environment Variables:
    - `DATABASE_URL`: Supabase Transaction Pooler connection string (Port `6543`, e.g., `postgresql://...:6543/postgres?pgbouncer=true`).
    - `JWT_SECRET`: Secure secret key for signing tokens.
    - `JWT_EXPIRES_IN`: `1d`
    - `NODE_ENV`: `production`
    - `FRONTEND_URL`: `https://task-management-frontend-kappa-five.vercel.app`

- **Frontend Vercel Deployment & Proxy Architecture**:
  - `frontend/vercel.json` defines an external rewrite proxy rule:
    ```json
    {
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "https://task-management-backend-five-chi.vercel.app/api/$1"
        },
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```
  - **Why Proxying is Used**: Browsers enforce strict third-party cookie restrictions. By proxying `/api/*` through the frontend domain, API requests and HttpOnly cookies are treated as **same-origin**, avoiding cookie rejection across different domains.
  - Required Environment Variable:
    - `VITE_API_BASE_URL`: `/api/v1` (relative path proxied through same origin).

---

## 🛠️ Development Notes

- **Cookie-Based JWT Authentication**: Auth tokens are stored in `httpOnly` cookies (`SameSite=Lax`), preventing client-side JavaScript access and shielding tokens from XSS vectors.
- **Mirrored Zod Validation**: Validation schemas are defined using Zod on both frontend and backend to guarantee complete contract parity across form inputs and API payload validation.
- **Functional Codebase Architecture**: Written exclusively using pure functions, custom hooks, and modular modules. No ES6 classes are used anywhere in src.
- **URL-Persisted Query Filters**: All table search, filter, and pagination parameters are synchronized with browser `useSearchParams`, allowing shareable URLs and view restoration on refresh.
- **Debounced Search Dispatch**: Client-side search input uses a custom 300ms debounce hook to minimize unnecessary backend server load.
- **Soft Deletes**: Database records (Projects & Tasks) utilize a `deletedAt` timestamp instead of hard physical record deletion, preserving historical auditability.
- **Auth Endpoint Rate Limiting**: IP-based rate limiting (`express-rate-limit`) is configured on authentication routes to mitigate brute-force attempts.
- **Production Security Headers & Logging**: Secured with `helmet` for HTTP headers and `morgan` for detailed request logging.

---

## 🤖 AI Assistant Usage

This project was built leveraging modern AI-assisted engineering practices:

- **AI Tools Used**:
  - **Claude (Anthropic)**: Used for system architecture design, multi-role RBAC planning, step-by-step prompt generation, and complex debugging guidance.
  - **Antigravity IDE**: Used as the primary AI coding assistant for in-editor code generation, execution of implementation prompts, and workflow automation.

- **Development Methodology**:
  - Built using **Prompt-Driven Development**.
  - The developer designed the software architecture, entity relational schemas, permissions matrix, and feature specifications.
  - Claude and Antigravity IDE translated these design specifications into executable code, unit tests, and migration scripts.
  - Continuous manual QA, automated Vitest suites, and TypeScript compilation checks were enforced after every generation phase before integrating features into `main`.

---

## 📄 License

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2026 Vishwanathan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```