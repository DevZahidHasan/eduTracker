# EduTracker Enterprise: Development Roadmap & Task Tracker

This file tracks the progress of the Enterprise-level features required for commercial school deployment.

## 📊 Progress Overview
- [x] **Task 1: Communication Gateway** (SMS & WhatsApp) - `COMPLETED`
- [x] **Task 2: Parent Access Portal** - `SKIPPED` (Relying on Push Notifications for local deployment)
- [ ] **Task 3: Library Management System** - `PENDING`
- [ ] **Task 4: Transport & Fleet Management** - `PENDING`
- [ ] **Task 5: Admissions & Lead CRM** - `PENDING`
- [ ] **Task 6: Staff HR & Payroll** - `PENDING`
- [ ] **Task 7: Inventory & Asset Management** - `PENDING`
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
- [ ] Define Prisma models for `Book`, `BookIssue`, and `LibraryMember`.
- [ ] Build an inventory dashboard (Add/Edit/Search books).
- [ ] Create an "Issue/Return" workflow with QR/Barcode support.
- [ ] Implement automatic "Overdue Fine" calculation linked to the Finance module.

### Task 4: Transport & Fleet Management
*Goal: Manage school bus routes, drivers, and transport-specific fees.*
- [ ] Define models for `BusRoute`, `Vehicle`, and `Driver`.
- [ ] Build a route management interface (Assigning stops and students).
- [ ] Integrate transport fees directly into the monthly `FeeVoucher` generator.
- [ ] Create a maintenance log for vehicles (Insurance, Service due alerts).

### Task 5: Admissions & Lead CRM
*Goal: Track prospective students and improve the enrollment rate.*
- [ ] Create an `Inquiry` model to track leads (Source, Status, Interested Grade).
- [ ] Build an Inquiry Form and Lead Management dashboard.
- [ ] Implement a "Follow-up" reminder system for the front-office staff.
- [ ] Build a "One-Click Admission" button to convert a Lead into a Student.

### Task 6: Staff HR & Payroll
*Goal: Automate staff salaries, attendance, and leave management.*
- [ ] Define models for `Staff`, `Attendance`, `LeaveRequest`, and `SalarySlip`.
- [ ] Build a payroll generator that calculates base salary + allowances - deductions (absent days).
- [ ] Create a "Print Salary Slip" feature (PDF).
- [ ] Implement a simple leave approval workflow for the Principal.

### Task 7: Inventory & Asset Management
*Goal: Track school property like furniture, computers, and lab equipment.*
- [ ] Create an `Asset` model (Name, Category, Purchase Date, Condition, Location).
- [ ] Build a dashboard to log new assets and track "Maintenance Due" dates.
- [ ] Add a "Scrap/Dispose" workflow for old inventory.

### Task 8: ID Card & Certificate Designer
*Goal: Eliminate the need for external designers for basic school documents.*
- [ ] Build a "Dynamic ID Card" generator that pulls student data/photos into a template.
- [ ] Create templates for "Leaving Certificates" and "Character Certificates".
- [ ] Implement "Bulk PDF Export" for a whole class or section.

---
*Note: Update this file after completing each task to maintain synchronization.*
