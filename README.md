# EduTracker

EduTracker is a comprehensive school management system designed to track student attendance, marks, routines, and academic reports. It features a robust backend powered by Node.js, Express, and Prisma, and a modern frontend built with Next.js.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (Ensure it's running and you have a database created)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eduTracker.git
cd eduTracker
```

### 2. Backend Setup

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/edutracker?schema=public"
PORT=5000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

*Note: Replace `username`, `password`, and `edutracker` with your PostgreSQL credentials and database name.*

### 3. Frontend Setup

Navigate back to the root directory and install dependencies:

```bash
cd ..
npm install
```

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database Setup

EduTracker uses Prisma as an ORM. To set up the database schema and seed initial data:

1.  **Generate Prisma Client:**
    ```bash
    cd backend
    npx prisma generate
    ```

2.  **Run Migrations:**
    Apply the database schema to your PostgreSQL instance:
    ```bash
    npx prisma migrate dev --name init
    ```

3.  **Seed the Database:**
    Populate the database with sample data (admin user, classes, subjects, etc.):
    ```bash
    npx prisma db seed
    ```
    *Default Admin Credentials:*
    - **Email:** `admin@edutracker.com`
    - **Password:** `admin123`

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```
The backend will be running at `http://localhost:5000`.

### Start the Frontend Server

In a new terminal, from the root directory:

```bash
npm run dev
```
The frontend will be running at `http://localhost:3000`.

## Project Structure

```text
eduTracker/
├── backend/            # Express.js Backend
│   ├── prisma/         # Prisma schema and migrations
│   ├── src/            # Backend source code
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/ # Custom middleware
│   │   ├── routes/     # API routes
│   │   └── services/   # Business logic
│   └── ...
├── src/                # Next.js Frontend
│   ├── app/            # App router pages
│   ├── components/     # UI components
│   ├── lib/            # Redux store and API utilities
│   └── ...
└── ...
```

## License

MIT
