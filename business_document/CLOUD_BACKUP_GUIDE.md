# eduTracker Cloud Backup Guide (Google Drive)

This document is for the **Business Owner / IT Administrator**. It explains how to configure the automated off-site backup system to protect institution data against server failure or local hardware damage.

---

## 1. Overview of the System

eduTracker provides a dual-layer backup strategy:
1.  **Local Backup:** Every night at 2:00 AM, a full SQL database dump is saved to the server's hard drive.
2.  **Cloud Sync:** If configured, the software immediately "pushes" that local file to a secure Google Drive folder.

**Benefits:**
*   **Disaster Recovery:** If the physical server is stolen or the hard drive crashes, you can recover the entire school database from Google Drive.
*   **Automation:** Once set up, no human intervention is required.
*   **Security:** Uses Google's Enterprise-grade Service Accounts (no need to share your personal Gmail password with the software).

---

## 2. Phase 1: Google Cloud Setup (Technical)

To allow eduTracker to "talk" to Google Drive, you must create a digital identity called a **Service Account**.

1.  **Access the Console:** Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Create a Project:** Click the project dropdown and select "New Project." Name it `eduTracker-Backups`.
3.  **Enable the API:** 
    *   Search for **"Google Drive API"** in the top search bar.
    *   Click the result and click the blue **ENABLE** button.
4.  **Create Credentials:**
    *   Go to **APIs & Services > Credentials** in the left sidebar.
    *   Click **+ CREATE CREDENTIALS** at the top and select **Service Account**.
    *   Name it `edutracker-backup-bot` and click **CREATE AND CONTINUE**.
    *   Click **DONE** on the next screens (no specific roles are required).
5.  **Download the JSON Key (CRITICAL):**
    *   In the list of Service Accounts, click on the email address you just created.
    *   Go to the **KEYS** tab.
    *   Click **ADD KEY > Create new key**.
    *   Select **JSON** and click **CREATE**.
    *   A file will download to your computer. **Open this file with Notepad; you will need to copy its contents later.**

---

## 3. Phase 2: Google Drive Setup (Shared Drive Required)

**CRITICAL NOTE:** Google does not allow Service Accounts to upload to a standard "My Drive" folder because they have a 0MB storage quota. To make this work, you **MUST** use a Google Workspace **Shared Drive**.

1.  **Create a Shared Drive:** 
    *   Login to your Google Workspace account (Business/Education).
    *   Go to Drive and click **Shared Drives** on the left.
    *   Click **New** and create a drive named `eduTracker Backups`.
2.  **Add the Service Account:** 
    *   Click **Manage members** on your new Shared Drive.
    *   Paste the **Service Account Email** (e.g., `edutracker-backup-bot@...`).
    *   Set the permission to **Contributor** or **Content Manager**.
3.  **Get the ID:** 
    *   Open the Shared Drive. The ID is the long string in the URL after `folders/`.

---

## 4. Why Personal (@gmail.com) accounts don't work
If you try to use a personal Gmail account, you will see an error: *"Service Accounts do not have storage quota."* 
*   Personal accounts do not support "Shared Drives."
*   Service accounts cannot use the 15GB space of a personal account.
*   **Solution:** Institutions should use their Google Workspace account to provide a Shared Drive.

---

## 4. Phase 3: Activating Cloud Sync in eduTracker

Once you have the **JSON Key** and the **Folder ID**, you can activate the system.

1.  Login to eduTracker as an **Admin**.
2.  Navigate to **Settings > Database & Backup**.
3.  Scroll down to the **Cloud Backup (Google Drive)** section.
4.  **Enable Cloud Sync:** Toggle the switch to ON.
5.  **Google Drive Folder ID:** Paste the ID you copied in Phase 2.
6.  **Service Account Credentials (JSON):** Paste the *entire* text from the JSON file you downloaded in Phase 1.
7.  Click **Save Cloud Configuration**.

---

## 5. Testing the System

To verify everything is working:
1.  Click the **"Backup Now"** button in the Database settings.
2.  Wait approximately 30-60 seconds (depending on your internet speed).
3.  Refresh your Google Drive folder. You should see a new `.sql` file with the current date.
4.  Check the Settings page; the "Last successful cloud sync" timestamp should update.

---

## 6. Security Warning

*   **The JSON Key is like a password.** Anyone with this file can access that specific Google Drive folder. Do not post it on public forums or share it with unauthorized personnel.
*   **Storage Space:** Google Drive has a storage limit (usually 15GB for free accounts). Remember to occasionally delete very old backups from your Google Drive to free up space.
