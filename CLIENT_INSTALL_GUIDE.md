# 🚀 EduTracker Enterprise ERP: Client Installation & Deployment Guide

This guide provides the exact steps to package the application for a client and install it on their local server/PC without exposing the source code.

---

## 📂 Step 1: Prepare the Distribution Package (On Your PC)
Generate the production build and gather only the necessary compiled files.

1.  **Generate Production Build**:
    Open a terminal in the project root and run:
    ```powershell
    npm run build
    cd backend
    npm run build
    cd ..
    ```

2.  **Create a New Folder**:
    Create a folder named `EduTracker_Release`.

3.  **Copy these specific Files/Folders**:
    Copy the following into `EduTracker_Release`:
    *   📁 `.next` (Compiled Frontend)
    *   📁 `node_modules` (Dependencies)
    *   📁 `public` (Assets & Logos)
    *   📁 `backend/dist` (Compiled Backend)
    *   📁 `backend/node_modules` (Backend Dependencies)
    *   📁 `backend/prisma` (Database Schema)
    *   📄 `package.json`
    *   📄 `backend/package.json`
    *   📄 `.env` (Frontend config)
    *   📄 `backend/.env` (Backend config)
    *   📄 `START_SYSTEM.bat` (The "Turn On" switch)
    *   📄 `setup.ps1` (The Installer)

4.  **⚠️ IMPORTANT: Remove Source Code**:
    Ensure you **DO NOT** copy any folder named `src`. This protects your intellectual property.

---

## 💻 Step 2: Client Machine Requirements
Before installing, ensure the client's PC has the following:

1.  **Node.js**: [Download here](https://nodejs.org/) (Use the "LTS" version).
2.  **PostgreSQL**: [Download here](https://www.postgresql.org/download/windows/) (Version 16 or 18).
    *   *Default password during install should be set to: `123456`*
    *   *Database name to create: `edutracker`*

---

## 🛠️ Step 3: Installation (On Client PC)

1.  **Paste the Folder**:
    Copy your `EduTracker_Release` folder to the client's `D:` or `C:` drive.

2.  **Run the One-Click Installer**:
    *   Right-click `setup.ps1`.
    *   Select **Run with PowerShell**.
    *   This script will:
        *   Detect the local office Wi-Fi IP address.
        *   Configure the system to work on their local network.
        *   Create a shortcut named **"EduTracker ERP"** on their Windows Desktop.

---

## 🏃 Step 4: Daily Operation

1.  **Start the System**:
    Double-click **`START_SYSTEM.bat`** inside the folder. This starts the engine.
2.  **Open the App**:
    Double-click the **"EduTracker ERP"** shortcut on the Desktop.

---

## 📶 Step 5: Access from Other Devices (Wi-Fi)
The system is designed to work across the whole school.
1.  Connect any other device (Laptop, Tablet, Phone) to the **same Wi-Fi** as the main PC.
2.  Open the browser and type the URL shown in the `START_SYSTEM.bat` window (e.g., `http://192.168.1.50:6001`).
3.  The staff can now log in from their own desks!

---

## 💾 Step 6: Data Safety (Backups)
*   Advise the client to go to **Settings > Database & Backup** once a week.
*   Click **Backup Now**.
*   Copy the files from `backend/backups` to a USB drive for safety.

---
*EduTracker Enterprise ERP - 2026 Distribution Manual*
