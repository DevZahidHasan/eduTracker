# EduTracker Deployment Guide (Windows IIS)

This guide provides step-by-step instructions for deploying the EduTracker Full-Stack application (Next.js & Express) on a Windows Server using IIS and `iisnode`.

---

## 1. Prerequisites

Before starting, ensure the following are installed on the target machine:

- **Node.js:** v18 or higher.
- **IIS (Internet Information Services):** Enabled via "Turn Windows features on or off".
- **URL Rewrite Module:** [Download here](https://www.iis.net/downloads/microsoft/url-rewrite).
- **iisnode:** [Download here](https://github.com/tjanczuk/iisnode).
- **PostgreSQL:** v15 or higher.

---

## 2. Database Setup

1.  Install PostgreSQL and create a database named `edutracker`.
2.  Ensure the PostgreSQL service is running.
3.  Note your connection string. 
    Format: `postgresql://USER:PASSWORD@localhost:5432/edutracker?schema=public`

---

## 3. Backend Deployment (`EduTrackerBackend`)

### 3.1 Preparation (On Development Machine)
1.  Navigate to the `backend` folder.
2.  Run `npm run build` to generate the `dist` folder.

### 3.2 Deployment (On Target Server)
1.  **Copy Files:** Copy the following to `C:\inetpub\wwwroot\EduTrackerBackend`:
    - `dist/`
    - `prisma/`
    - `node_modules/`
    - `package.json`
    - `web.config`
2.  **Environment Variables:** Create a `.env` file in the root of the backend folder:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/edutracker?schema=public"
    PORT=5000
    NODE_ENV=production
    FRONTEND_URL="http://YOUR_SERVER_IP:6001"
    ACCESS_TOKEN_SECRET="generate_a_long_random_string"
    REFRESH_TOKEN_SECRET="generate_another_long_random_string"
    ```
3.  **Run Migrations:** Open PowerShell as Administrator in the backend folder and run:
    ```powershell
    npx prisma migrate deploy
    ```
4.  **IIS Configuration:**
    - Open IIS Manager.
    - Right-click "Sites" -> "Add Website".
    - Site Name: `EduTrackerBackend`.
    - Physical Path: `C:\inetpub\wwwroot\EduTrackerBackend`.
    - Port: `5000`.

---

## 4. Frontend Deployment (`EduTrackerFrontend`)

### 4.1 Preparation (On Development Machine)
1.  **Set Production IP:** In the root `.env` file, set the IP of the **Target Server**:
    ```env
    NEXT_PUBLIC_API_URL="http://YOUR_SERVER_IP:5000/api"
    ```
2.  **Build Application:** Run `npm run build`. This embeds the correct API URL into the compiled code.

### 4.2 Deployment (On Target Server)
1.  **Copy Files:** Copy the following to `C:\inetpub\wwwroot\EduTrackerFrontend`:
    - `.next/`
    - `public/`
    - `node_modules/`
    - `server.js`
    - `package.json`
    - `frontend.web.config` (Rename to `web.config` on the server)
2.  **IIS Configuration:**
    - Open IIS Manager.
    - Right-click "Sites" -> "Add Website".
    - Site Name: `EduTrackerFrontend`.
    - Physical Path: `C:\inetpub\wwwroot\EduTrackerFrontend`.
    - Port: `6001`.

---

## 5. Permissions (Crucial Step)

IIS requires explicit permissions to access the files.
1.  Right-click the `EduTrackerFrontend` and `EduTrackerBackend` folders in `C:\inetpub\wwwroot`.
2.  Go to **Properties** -> **Security** -> **Edit**.
3.  Click **Add**, type `IIS_IUSRS`, and click OK.
4.  Ensure `IIS_IUSRS` has the following permissions:
    - Read & execute
    - List folder contents
    - Read
    - Write (Required for the `iisnode` folder so it can generate error logs)
5.  Click **Apply** and **OK**.

---

## 6. Troubleshooting

- **500 Errors:** Check for logs in `C:\inetpub\wwwroot\EduTrackerBackend\dist\iisnode\` or `C:\inetpub\wwwroot\EduTrackerFrontend\iisnode\`. If the folder doesn't exist, ensure `IIS_IUSRS` has **Write** permission.
- **CORS Errors:** Ensure `FRONTEND_URL` in the Backend `.env` matches the Frontend URL (`http://IP:6001`) exactly (no trailing slash unless specified).
- **Prisma Errors:** Ensure the `DATABASE_URL` in `.env` is correct and the PostgreSQL service is running.
- **Next.js 404s:** Ensure the `web.config` in the frontend has the rewrite rule for `_next/static`.

---

## 7. Useful Commands
- Restart IIS: `iisreset` (Run as Admin).
- Check Backend Logs: `type C:\inetpub\wwwroot\EduTrackerBackend\dist\iisnode\*.txt`.