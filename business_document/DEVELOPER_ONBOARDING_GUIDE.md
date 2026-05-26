# eduTracker: Developer Onboarding Guide

Welcome to the eduTracker development team! This guide explains how to set up the project on your local machine for development after cloning or pulling from the Git repository.

---

## 1. Prerequisites

Before you start, ensure your local development machine has the following installed:
*   **Git**: For version control.
*   **Node.js**: Version 18 or higher (LTS recommended).
*   **PostgreSQL**: Version 14 or higher (Make sure it's running locally).
*   **pgAdmin 4** (Optional but recommended): For viewing the local database.

---

## 2. Initial Setup (First Time Only)

Clone the repository to your local machine and open the terminal in the root folder.

### Step 1: Frontend Setup
The frontend (Next.js) is located in the root directory.
1. Open a terminal in the root folder (`eduTracker`).
2. Install dependencies:
   ```bash
   npm install
   ```

### Step 2: Backend Setup
The backend (Node.js/Express) is located in the `backend` directory.
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```

---

## 3. Environment & Database Configuration

You need to configure the local environment variables and set up your local PostgreSQL database.

### Step 1: Create the Local Database
1. Open pgAdmin 4 or your psql command line tool.
2. Create a new database named `edutracker_dev`.

### Step 2: Configure Backend `.env`
1. Inside the `backend` folder, create a new file named `.env`.
2. Add the following development variables:
   ```env
   # PostgreSQL Database Connection
   DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/edutracker_dev?schema=public"

   # JWT Secret for User Authentication
   JWT_SECRET="dev_secret_key_12345"

   # License Master Secret
   LICENSE_SECRET="edu-tracker-master-license-secret-key-2026"

   # CORS Configuration
   FRONTEND_URL="http://localhost:3000"
   PORT=6002
   ```

### Step 3: Run Database Migrations & Seeding
Still inside the `backend` terminal, run the following Prisma commands to build your local database schema and insert default test data:
```bash
npx prisma migrate dev
npm run seed
```

---

## 4. Running the Application for Development

Whenever you want to work on the project, you need to run both the frontend and backend servers simultaneously.

### Terminal 1: Run the Backend
1. Open a terminal in the `backend` folder.
2. Start the development server (runs with nodemon for hot-reloading):
   ```bash
   npm run dev
   ```
   *(The backend should start on port 6002)*

### Terminal 2: Run the Frontend
1. Open a second terminal in the root folder (`eduTracker`).
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *(The frontend should start on port 3000)*

---

## 5. Bypassing the License Lockout Locally

Because eduTracker uses an enterprise licensing system, you will be locked out of the dashboard by default on your local machine. 

To generate a test license for yourself:
1. Open a terminal in the `backend` folder.
2. Run the license generator script:
   ```bash
   node scripts/generate-license.js "Local Dev School" annual 365
   ```
3. Copy the long `LICENSE KEY` output.
4. Go to `http://localhost:3000` in your browser.
5. Paste the key into the "System Locked" screen and click **Activate License**.

You are now fully set up and ready to develop! Happy coding!
