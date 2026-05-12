# Installation & Setup Guide

This guide provides the exact steps required to get **EduTracker** running on your local machine after pulling the project from Git.

## 1. Prerequisites

Ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: A running instance with a database created (e.g., named `edutracker`)
- **Git**: To pull the repository

---

## 2. Initial Installation

Clone the repository and install dependencies for both the frontend and backend.

```bash
# Clone the project
git clone <repository-url>
cd eduTracker

# Install Frontend dependencies (Root directory)
npm install

# Install Backend dependencies
cd backend
npm install
```

---

## 3. Environment Configuration

You must create environment files as they are excluded from Git for security.

### Backend (`backend/.env`)
Create a file at `backend/.env` and add:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/edutracker?schema=public"
PORT=5000
ACCESS_TOKEN_SECRET=use_a_long_random_string_here
REFRESH_TOKEN_SECRET=use_another_long_random_string_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```
*Replace `USERNAME`, `PASSWORD`, and `edutracker` with your actual PostgreSQL credentials.*

### Frontend (`.env.local`)
Create a file in the root directory named `.env.local` and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 4. Database Initialization

EduTracker uses Prisma to manage the database. Run these commands inside the `backend/` folder:

```bash
# 1. Generate the Prisma Client
npx prisma generate

# 2. Push the schema to your PostgreSQL database
npx prisma migrate dev --name init

# 3. Seed the database with initial data (Admin user, classes, etc.)
npx prisma db seed
```

---

## 5. Running the Project

You will need two terminal windows open.

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
*Server runs at: `http://localhost:5000`*

### Terminal 2: Frontend
```bash
# From the root directory
npm run dev
```
*Application runs at: `http://localhost:3000`*

---

## 6. Verification
1. Open `http://localhost:3000/login` in your browser.
2. Log in with the default admin credentials:
   - **Email:** `admin@edutracker.com`
   - **Password:** `admin123`
3. If the dashboard loads and you see data, the setup is complete!
