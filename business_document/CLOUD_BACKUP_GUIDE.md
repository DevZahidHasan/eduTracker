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

## 3. Phase 2: Google Drive Setup

Now you must give your new "Backup Bot" permission to save files in your Drive.

1.  **Create a Folder:** Open your Google Drive and create a new folder (e.g., `eduTracker_Database_Backups`).
2.  **Share the Folder:** 
    *   Right-click the folder and select **Share**.
    *   Go back to your Google Cloud tab and copy the **Service Account Email** (e.g., `bot@project-id.iam.gserviceaccount.com`).
    *   Paste that email into the Share box in Google Drive.
    *   **Crucial:** Set the permission to **Editor**.
3.  **Get the Folder ID:** 
    *   Double-click to open your new folder.
    *   Look at the URL in your browser. It will look like this:
        `https://drive.google.com/drive/folders/1XyZ_ABC_123456789...`
    *   Copy the string of letters and numbers **after the last slash**. This is your **Folder ID**.

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
