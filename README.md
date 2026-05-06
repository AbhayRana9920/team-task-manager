# 🚀 Team Task Manager

A **full-stack web application** for managing team projects, tasks, and collaboration with **role-based access control**. Built with **React + Vite + Tailwind CSS** frontend and **Spring Boot 3 + Java 17** backend.

![Team Task Manager](https://img.shields.io/badge/Status-Production--Ready-brightgreen) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-green?logo=springboot) ![React](https://img.shields.io/badge/React-18.3-blue?logo=react) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## ✨ Features

### Authentication & Authorization
- 🔐 JWT-based authentication (signup/login)
- 🔑 BCrypt password hashing
- 👑 Role-based access control (ADMIN & MEMBER)
- 🛡️ Protected routes and API endpoints

### Project Management
- 📁 Create, edit, and delete projects (Admin)
- 👥 Add/remove team members to projects
- 📊 View project details with task counts

### Task Management
- ✅ Create, assign, and track tasks
- 📋 Task status: TODO → IN_PROGRESS → COMPLETED
- 🎯 Priority levels: LOW, MEDIUM, HIGH
- 📅 Due date tracking with overdue detection
- 🔄 Members can update their own task status

### Dashboard
- 📈 Admin: Full overview with stats, charts, and breakdowns
- 📊 Member: Personal task summary and progress
- ⚠️ Overdue task highlighting

### UI/UX
- 🌙 Modern dark theme with glassmorphism design
- 🎨 Premium color palette with gradient accents
- ✨ Smooth animations and micro-interactions
- 📱 Fully responsive layout
- 🔔 Toast notifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Backend | Spring Boot 3.2.5 + Java 17 |
| Database | PostgreSQL |
| Auth | JWT (jjwt 0.12.5) + BCrypt |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Deployment | Railway (Docker) |

---

## 👥 Role-Based Access

| Feature | Admin | Member |
|---------|-------|--------|
| Create projects | ✅ | ❌ |
| Edit/delete projects | ✅ | ❌ |
| Add team members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| Update all tasks | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| View assigned projects | ✅ | ✅ |
| View assigned tasks | ✅ | ✅ |
| Update own task status | ✅ | ✅ |
| View dashboard | ✅ (Full) | ✅ (Personal) |

---

## 📸 Screenshots

> Add screenshots of your deployed application here.

---

## 🌐 Live Demo

> **Live URL**: `[Add Railway URL after deployment]`
>
> **Demo Video**: `[Add video link]`
>
> **GitHub Repo**: `[Add repo URL]`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.com` | `admin123` |
| Member | `member@test.com` | `member123` |

---

## 🚀 Local Setup

### Prerequisites
- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+**
- **PostgreSQL 14+**

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

### 2. Database Setup
```sql
CREATE DATABASE team_task_manager;
```

### 3. Backend Setup
```bash
cd backend
# Update application.properties if needed (default: localhost:5432/team_task_manager)
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DB_URL` | PostgreSQL URL | `jdbc:postgresql://localhost:5432/team_task_manager` |
| `DB_USERNAME` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | `postgres` |
| `JWT_SECRET` | JWT signing key | Auto-generated |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `""` (uses proxy in dev) |

---

## 🚂 Railway Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Team Task Manager"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

### Step 2: Deploy Backend on Railway
1. Go to [Railway](https://railway.app) → New Project
2. Add **PostgreSQL** service
3. Add **New Service** → Deploy from GitHub repo
4. Set **Root Directory**: `backend`
5. Add environment variables:
   - `DB_URL` = `${{Postgres.DATABASE_URL}}` (Railway provides this)
   - `DB_USERNAME` = `${{Postgres.PGUSER}}`
   - `DB_PASSWORD` = `${{Postgres.PGPASSWORD}}`
   - `JWT_SECRET` = `your-super-secret-key-at-least-256-bits`
   - `FRONTEND_URL` = `https://your-frontend.up.railway.app`

### Step 3: Deploy Frontend on Railway
1. Add **New Service** → Deploy from same GitHub repo
2. Set **Root Directory**: `frontend`
3. Add build argument:
   - `VITE_API_BASE_URL` = `https://your-backend.up.railway.app`

### Step 4: Update CORS
- Update backend `FRONTEND_URL` env var with actual frontend Railway URL

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Auth |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/projects` | Create project | Admin |
| GET | `/api/projects` | List projects | Auth |
| GET | `/api/projects/{id}` | Get project | Auth |
| PUT | `/api/projects/{id}` | Update project | Admin |
| DELETE | `/api/projects/{id}` | Delete project | Admin |
| POST | `/api/projects/{id}/members/{userId}` | Add member | Admin |
| DELETE | `/api/projects/{id}/members/{userId}` | Remove member | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/tasks` | Create task | Admin |
| GET | `/api/tasks` | List tasks | Auth |
| GET | `/api/tasks/{id}` | Get task | Auth |
| PUT | `/api/tasks/{id}` | Update task | Admin |
| DELETE | `/api/tasks/{id}` | Delete task | Admin |
| PATCH | `/api/tasks/{id}/status` | Update status | Auth |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/admin` | Admin stats | Admin |
| GET | `/api/dashboard/member` | Member stats | Auth |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List all users | Auth |

---

## 📂 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/main/java/com/ttm/
│   │   ├── config/           # Security, CORS, DataInitializer
│   │   ├── controller/       # REST Controllers
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── entity/           # JPA Entities
│   │   ├── enums/            # Role, TaskStatus, TaskPriority
│   │   ├── exception/        # Global Exception Handler
│   │   ├── repository/       # JPA Repositories
│   │   ├── security/         # JWT Filter & Provider
│   │   └── service/          # Business Logic
│   ├── src/main/resources/application.properties
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios Instance
│   │   ├── components/       # Reusable Components
│   │   ├── context/          # Auth Context
│   │   └── pages/            # Application Pages
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── README.md
└── .gitignore
```

---

## 🎬 Demo Video Script (2-5 min)

1. **Intro** (30s): Show login page, explain the project
2. **Admin Login** (30s): Login as admin, show dashboard stats
3. **Create Project** (30s): Create a project, add team members
4. **Create & Assign Task** (30s): Create a task, assign to member
5. **Member View** (30s): Login as member, show limited access
6. **Status Update** (30s): Update task status as member
7. **Dashboard** (30s): Show updated dashboard stats
8. **Wrap Up** (30s): Highlight tech stack and deployment

---

## 📄 License

This project is built for educational/assignment purposes.

---

**Built with ❤️ using Spring Boot + React + PostgreSQL**
