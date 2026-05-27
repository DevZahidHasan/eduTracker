# On-Premise Commercialization Plan

This document outlines the strategic roadmap to transform eduTracker into a professional, sellable product tailored for on-premise (self-hosted) client deployments.

## Phase 1: World-Class UI/UX Design (The "Wow" Factor)
- [x] **Modern Animations & Transitions:** Implement smooth page transitions and micro-interactions using Framer Motion (already in dependencies) to make the app feel alive and responsive.
- [x] **Premium Aesthetics:** Refine spacing, typography, and shadows to match top-tier enterprise SaaS standards. Ensure consistent, accessible contrast ratios.
- [x] **Responsive & Mobile-First:** Rigorously test and polish all layouts (especially data tables and complex forms) on mobile and tablet devices, as many end-users will access via mobile.
- [x] **Feedback Mechanisms:** Standardize loading states (skeletons, spinners), success toasts, and error states so the user never feels lost or stuck.
- [x] **Dashboard Refinement:** Redesign the primary landing dashboards (Principal, Teacher, Student) to surface the most critical, actionable insights immediately upon login, maximizing visual impact.

## Phase 2: License Management (Protecting Revenue)
- [x] **Design License Key Format:** Define a secure format for license keys (e.g., JWT or cryptographically signed strings) containing expiry dates and client info.
- [x] **License Verification Logic:** Implement middleware in the backend to verify the license key on critical API routes or daily via a cron job.
- [x] **License UI:** Create a settings page in the frontend for admins to enter/update their license key.
- [x] **Expiry Handling:** Implement graceful degradation of features (or a lockout screen) when a license expires, prompting renewal.
- [x] **(Optional) Master Server:** Build a simple external service to generate and track issued licenses.

## Phase 3: Bulletproof Deployment (Infrastructure)
- [x] **Dockerize Backend:** (Skipped - Using native IIS deployment via iisnode)
- [x] **Dockerize Frontend:** (Skipped - Using native IIS deployment with standalone Next.js server)
- [x] **Docker Compose Setup:** (Skipped - Handled via `install-iis-server.ps1`)
- [x] **Environment Configuration:** Standardize the `.env` template so clients only need to fill out a few variables. (Handled during IIS setup)
- [x] **Deployment Script:** Write a single script (e.g., `install.sh` or `install.bat`) that runs docker-compose and sets up initial data. (Implemented via `install-iis-server.ps1` for IIS deployment)

## Phase 4: Automated Backup & Recovery
- [x] **Enhance Local Backups:** Ensure `backup.service.ts` reliably dumps the PostgreSQL database via a scheduled cron job.
- [x] **Backup Management UI:** Create a dashboard for admins to view, download, and delete local backup files.
- [x] **Cloud Sync Option:** Integrate AWS S3 or Google Drive APIs to allow clients to optionally sync their local backups off-site. (Optional - Configurable via Settings)
- [ ] **Restore Documentation:** Write clear instructions for clients on how to restore a database dump.

## Phase 5: Application Updates Mechanism
- [x] **Automated Migrations:** Configure the startup sequence in `server.ts` to automatically run `prisma migrate deploy` before accepting traffic.
- [x] **Version Endpoint:** Added `/api/version` endpoint and included version in health check.
- [x] **Update Script/Process:** Handled via existing IIS deployment scripts and auto-migration logic.

## Phase 6: Application Polish & White-labeling
- [x] **White-label Settings:** Database stores Logo, Name, and Accent Color.
- [x] **Dynamic Styling:** Implemented dynamic `--primary` color injection in `DashboardLayout.tsx` based on user selection.
- [x] **Dynamic Sidebar:** Sidebar now displays the institution's uploaded logo.
- [x] **Print/PDF Templates:** reportCardHtmlGenerator dynamically uses school details for all exports.

## Phase 7: High-Value Features (Selling Points)
- [ ] **Exam Weightage Engine:** Build a system to calculate "Annual Results" by allowing admins to assign percentage weights to different Assessment Types (e.g., Mid-Term 30%, Final 70%).
- [ ] **WhatsApp/SMS Integration:** Refine the Twilio/WhatsApp integration for automated alerts (Attendance, Fees).
- [ ] **Fee Management Pro:** Add a "Fine Management" system for late returns in the Library and automated "Invoicing" (PDF generation for School Fees).
- [x] **Data Importers:** Build robust, error-handling CSV uploaders for Students, Staff, and Books to ensure smooth onboarding. (Implemented with template downloads and error reporting)
- [x] **Analytics Dashboards:** Polish the Principal/Admin dashboard with visually appealing Recharts data.
