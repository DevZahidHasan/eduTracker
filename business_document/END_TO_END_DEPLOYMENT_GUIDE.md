# eduTracker: End-to-End Deployment Guide

This document is your master playbook. It covers the entire lifecycle of selling and deploying the eduTracker ERP, from preparing the files on your developer laptop to activating the software on the client's school server.

---

## PART 1: On Your Developer PC (Preparing the Sale)

Before you go to the client's school or connect to their server remotely, you must compile the code and strip out all source files so they cannot steal your work.

### Step 1: Set the Client's Secret Key
1. Open your laptop. Navigate to `backend/.env`.
2. Find or create the `LICENSE_SECRET` variable.
3. Change it to a new, long random password specific to this client (e.g., `LICENSE_SECRET="DPS_Secret_Key_998877"`).
4. Save the file.

### Step 2: Bundle the Release
1. Open PowerShell as Administrator in your main `eduTracker` code folder.
2. Run your release script:
   ```powershell
   .\bundle_release.ps1
   ```
3. This script will build the frontend, build the backend, and copy ONLY the necessary production files into a new folder called `EduTracker_Release`.
4. **Security Check:** Open the `EduTracker_Release` folder. Ensure there is no `src` folder inside, and ensure the `backend/scripts/generate-license.js` file is **NOT** in there.

### Step 3: Transfer to USB / Cloud
1. Copy the entire `EduTracker_Release` folder onto a USB flash drive, or zip it and upload it to Google Drive so you can download it on the client's server.

---

## PART 2: On the Client's Server (Installation)

Now you are physically at the school or remoted into their Windows Server.

### Step 1: Server Prerequisites
Ensure the client's server has the following installed:
1. **Node.js** (v18+)
2. **PostgreSQL** (v14+)
3. **URL Rewrite Module** for IIS (Download from Microsoft)
4. **iisnode** (Download from GitHub/Microsoft)

### Step 2: Prepare the Database
1. Open **pgAdmin 4** on the client's server.
2. Create a new, empty database named `edutracker`.

### Step 3: Copy Files & Configure `.env`
1. Copy the `EduTracker_Release` folder from your USB drive to the server's `C:\inetpub\wwwroot` folder (or another permanent location).
2. Open the `EduTracker_Release\backend` folder. Rename `.env.example` to `.env`.
3. Open `EduTracker_Release\backend\.env`.
4. Set the `DATABASE_URL` with the correct PostgreSQL password for their server.
5. Verify that the `LICENSE_SECRET` perfectly matches the one you set on your laptop in Part 1.

### Step 4: The One-Click Install
1. Inside the `EduTracker_Release` folder, locate the file named **`install-iis-server.ps1`**.
2. **Right-click** the file and select **Run with PowerShell** (Ensure you run it as Administrator).
3. The script will automatically:
   * Build all the database tables.
   * Inject the default Admin account.
   * Turn on Windows IIS features.
   * Configure the Backend and Frontend to run silently in the background as Windows Services.
4. When it says "INSTALLATION COMPLETE", the software is running!

---

## PART 3: Activation (Generating the Key)

The software is running on their server, but if they go to `http://localhost:6001`, they will see the red **"System Locked"** screen because they don't have a license key yet.

### Step 1: Generate the Key (Back on your Laptop)
1. Open your laptop (the one with the `generate-license.js` script).
2. Ensure your local `backend/.env` still has the matching `LICENSE_SECRET`.
3. Open a terminal in the `backend` folder and run the generator:
   ```bash
   node scripts/generate-license.js "Delhi Public School" annual 365
   ```
4. Copy the massive token string it outputs.

### Step 2: Unlock the Client's Server
1. Go back to the client's server (or ask the Principal to open the app on their computer).
2. On the "System Locked" screen, paste the long token you generated.
3. Click **Activate License**.
4. The system will verify the key against the secret, save it to their PostgreSQL database, and unlock the dashboard!

**Deployment Complete.** The school is now successfully onboarded and their software will automatically lock them out in exactly 365 days.

### Step 3: First Login
Once the system is unlocked, you can log in to the administrator dashboard using the default credentials provisioned by the installer:
* **Email:** `admin@school.com`
* **Password:** `admin123`

*(Note: Instruct the school administrator to change this password immediately after the first login.)*
