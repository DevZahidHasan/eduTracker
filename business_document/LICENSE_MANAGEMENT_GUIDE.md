# eduTracker License Management Guide

This document is for the **Business Owner / Developer**. It explains how the license protection system works and the exact steps required before installing the software on a client's server.

## 1. How the Security Works

The software uses JSON Web Tokens (JWT) for cryptographic security. 
*   A license key is not just a random string of text; it is a mathematically signed package that contains the Client's Name and an Expiration Date.
*   It is signed using a **Master Secret Password** (`LICENSE_SECRET`). 
*   Because the client does not know this secret password, they cannot generate their own keys. If they try to forge a key, the math will fail, and the software will remain locked.

### The Expiration Timer
The token contains a fixed, absolute calendar date (e.g., exactly 365 days from the moment you generate it). 
*   Every time the software runs, it checks the server's current calendar date against the date inside the token.
*   If the current date is past the expiration date, the backend API completely shuts off, and the frontend locks the user out.
*   Turning off the server does **not** stop the timer, because it relies on the absolute calendar date.

---

## 2. The Pre-Sale Checklist (CRITICAL)

Before you zip up the code and install it on a client's server (or provide them the files), you **MUST** complete these steps to protect your software:

### Step 1: Set a Unique Master Secret
You must generate a long, complex, random string. Do not use the default fallback secret.
1. Open the `.env` file in the `backend` folder on the **Client's Server**.
2. Add the variable: `LICENSE_SECRET=Your_Long_Random_Password_Here`

*Note: You must use this exact same password on your personal laptop when generating their key.*

### Step 2: Delete the Generator Script
You cannot give the client the tool that creates the keys!
1. Before giving the files to the client, delete the entire `scripts` folder or specifically the file: `backend/scripts/generate-license.js`.
2. Keep this file **only on your personal computer**.

---

## 3. How to Generate a Key for a Paying Client

When a school pays you, you will use your personal computer (which still has the `generate-license.js` script) to create their key.

1. Ensure your local `backend/.env` file has the **exact same** `LICENSE_SECRET` that you put on the client's server.
2. Open your terminal in the `backend` folder.
3. Run the generator script with three arguments:
   `node scripts/generate-license.js "Name of School" "License Type" NumberOfDays`

**Example (1-Year License):**
```bash
node scripts/generate-license.js "Delhi Public School" annual 365
```

**Example (14-Day Trial):**
```bash
node scripts/generate-license.js "Oxford Academy" trial 14
```

4. The terminal will output a very long string (starting with `eyJhbG...`). 
5. Copy this string and email/WhatsApp it to the client.

---

## 4. How the Client Activates the Software

1. Once the software is installed on the client's Windows Server, they will visit the dashboard.
2. Because the database is empty, they will immediately see the **"System Locked"** screen.
3. They paste the long string you gave them into the box and click "Activate".
4. The software will verify the signature, save it to the database, and unlock the application.
