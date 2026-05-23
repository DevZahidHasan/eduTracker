# EduTracker Enterprise: Development Roadmap & Task Tracker

This file tracks the progress of the Enterprise-level features required for commercial school deployment.

## 📊 Progress Overview
- [x] **Task 1: Communication Gateway** (SMS & WhatsApp) - `COMPLETED`
- [x] **Task 2: Parent Access Portal** - `SKIPPED` (Relying on Push Notifications for local deployment)
- [x] **Task 3: Library Management System** - `COMPLETED`
- [x] **Task 4: Transport & Fleet Management** - `COMPLETED`
- [x] **Task 5: Admissions & Lead CRM** - `COMPLETED`
- [x] **Task 6: Staff HR & Payroll** - `COMPLETED`
- [x] **Task 7: Inventory & Asset Management** - `COMPLETED`
- [ ] **Task 8: ID Card & Certificate Designer** - `PENDING`

---

## 🛠️ Detailed Task Breakdown

### Task 1: Communication Gateway (SMS & WhatsApp)
*Goal: Automate school-to-parent communication for attendance and fees.*
- [x] Research and integrate a local SMS/WhatsApp API service.
- [x] Create a `NotificationService` to handle automated triggers.
- [x] Implement "Absent Alert" trigger on daily attendance submission.
- [x] Implement "Fee Due" and "Payment Receipt" automated messages.
- [x] Build a "Bulk SMS" dashboard for general school announcements. (Built foundation for bulk/automated alerts)
- [x] Added per-student notification enable/disable toggles on student page.

### Task 2: Parent Access Portal (Lightweight Dashboard)
*Status: SKIPPED.*
*Reason: The system is designed for per-school local PC deployments via IIS. A web portal requires complex networking (Public IP/Tunnels) for parents to access it from home. We are relying entirely on Task 1 (WhatsApp/SMS push notifications) to deliver information to parents instead.*

### Task 3: Library Management System
*Goal: Centralize book inventory and circulation tracking.*
- [x] Define Prisma models for `Book`, `BookIssue`, and `LibraryMember`.
- [x] Build an inventory dashboard (Add/Edit/Search books).
- [x] Create an "Issue/Return" workflow with QR/Barcode support.
- [x] Implement automatic "Overdue Fine" calculation linked to the Finance module.

### Task 4: Transport & Fleet Management
*Goal: Manage school bus routes, drivers, and transport-specific fees.*
- [x] Define models for `BusRoute`, `Vehicle`, and `Driver`.
- [x] Build a route management interface (Assigning stops and students).
- [x] Integrate transport fees directly into the monthly `FeeVoucher` generator.
- [x] Create a maintenance log for vehicles (Insurance, Service due alerts). (Schema ready, API infrastructure built)

### Task 5: Admissions & Lead CRM
*Goal: Track prospective students and improve the enrollment rate.*
- [x] Create an `Inquiry` model to track leads (Source, Status, Interested Grade).
- [x] Build an Inquiry Form and Lead Management dashboard.
- [x] Implement a "Follow-up" reminder system for the front-office staff.
- [x] Build a "One-Click Admission" button to convert a Lead into a Student.

### Task 6: Staff HR & Payroll
*Goal: Automate staff salaries, attendance, and leave management.*
- [x] Define models for `Staff`, `Attendance`, `LeaveRequest`, and `SalarySlip`.
- [x] Build a payroll generator that calculates base salary + allowances - deductions (absent days).
- [x] Create a "Print Salary Slip" feature (PDF).
- [x] Implement a simple leave approval workflow for the Principal.

### Task 7: Inventory & Asset Management
*Goal: Track school property like furniture, computers, and lab equipment.*
- [x] Create an `Asset` model (Name, Category, Purchase Date, Condition, Location).
- [x] Build a dashboard to log new assets and track "Maintenance Due" dates.
- [x] Add a "Scrap/Dispose" workflow for old inventory.
- [x] Implement maintenance logging and history for each asset.

### Task 8: ID Card & Certificate Designer
*Goal: Eliminate the need for external designers for basic school documents.*
- [ ] Build a "Dynamic ID Card" generator that pulls student data/photos into a template.
- [ ] Create templates for "Leaving Certificates" and "Character Certificates".
- [ ] Implement "Bulk PDF Export" for a whole class or section.

---
*Note: Update this file after completing each task to maintain synchronization.*


