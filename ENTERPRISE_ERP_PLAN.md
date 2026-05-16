# 🏫 EduTracker Enterprise ERP: Master Implementation Plan

## 📊 Progress Tracker
- [x] **Phase 1:** Enterprise Schema Expansion
- [x] **Phase 2:** Institutional Branding & PDF Headers
- [x] **Phase 3:** Fee Automation & Receipts
- [x] **Phase 4:** Result Aggregation & GPA Engine
- [x] **Phase 5:** Professional Report Cards
- [x] **Phase 6:** Bulk ID Card Generator
- [x] **Phase 7:** Automated Data Safeguard (Backup)
- [x] **Phase 8:** One-Click Local Installer
- [x] **Phase 9:** Enterprise RBAC (Permissions)
- [x] **Phase 10:** Local Network Wi-Fi Access

This document serves as the technical blueprint to transform **EduTracker** from a classroom tool into a commercial-grade School/University ERP system. Each phase is designed as a "Prompt" that provides the necessary context and instructions for an AI developer to execute.

---

## Phase 1: The Database Backbone (The Money & HR Schema)
**Goal:** Prepare the database for complex financial and administrative operations.

### 📝 Prompt 1: Enterprise Schema Expansion
> "Update `backend/prisma/schema.prisma` to include the following models:
> 1. **Financials:** `FeeType` (Tuition, Transport), `FeeStructure` (Class-based amounts), `FeeVoucher` (Student monthly bill), and `FeePayment`.
> 2. **HR & Payroll:** `StaffSalary` (Base, Allowances, Deductions) and `PayrollRecord`.
> 3. **Academic Results:** `GradeScale` (Scale for A, B, C grades) and `TermResult` (Aggregated marks from all subjects).
> 4. **Relations:** Link `FeeStructure` to `SchoolClass`, and `StaffSalary` to `User`.
> 5. **Migration:** Run the Prisma migration and generate the client."

---

## Phase 2: Institutional Branding & Global Context
**Goal:** Ensure the school's identity is baked into every document the system produces.

### 📝 Prompt 2: School Profile & PDF Headers
> "Implement the 'Institutional Identity' system:
> 1. **Backend:** Create a controller and route to update `SchoolProfile` (Name, Logo, Address, Phone, Website).
> 2. **Frontend:** Create a 'School Settings' page in the dashboard.
> 3. **Branding Engine:** Update the `pdfGenerator.ts` and `QuestionPaperHtmlGenerator.ts` to fetch these settings dynamically. Every generated PDF must now feature the school logo and header automatically."

---

## Phase 3: The Financial Engine (Fee Management)
**Goal:** Automate the revenue cycle of the school.

### 📝 Prompt 3: Automatic Voucher Generation Logic
> "Create a 'Fee Automation Service' in the backend:
> 1. Build a service that can generate monthly `FeeVouchers` for all students in a specific class with one click.
> 2. Logic: The voucher should total all `FeeType` amounts defined in the `FeeStructure` for that student's class.
> 3. Implement an 'Accountant Dashboard' in the frontend to view unpaid/paid statistics."

### 📝 Prompt 4: Fee Collection & Dual-Copy Receipts
> "Implement the 'Payment Collection' workflow:
> 1. **UI:** A searchable interface to find a student and view their pending vouchers.
> 2. **Action:** A 'Collect Payment' modal that accepts partial or full payments.
> 3. **PDF Receipt:** Generate a professional receipt that prints **two copies on one A4 sheet** (Office Copy and Student Copy), containing the transaction ID, date, and items paid."

---

## Phase 4: Academic Results & Automated Grading
**Goal:** Eliminate manual marks aggregation and calculation.

### 📝 Prompt 5: Result Aggregation & Auto-Grading
> "Build the 'Consolidated Result' engine:
> 1. **Backend Service:** Create a logic to fetch all `Marks` for a student across all subjects for a specific `ExamType`.
> 2. **GPA Calculation:** Calculate the total percentage and map it to the `GradeScale` (e.g., 80% = A).
> 3. **API:** Create an endpoint `GET /reports/consolidated/:studentId/:examType`."

### 📝 Prompt 6: Professional Report Card PDF
> "Design and implement the 'Annual Report Card' generator:
> 1. Create a beautiful, print-ready PDF template.
> 2. Elements: Student photo, Subject-wise Marks/Grades table, Attendance percentage, Class Teacher's Remarks (AI-assisted), and Principal's Signature line.
> 3. Add a 'Bulk Export' feature to generate report cards for an entire class at once."

---

## Phase 5: Operations & Identity Management
**Goal:** Provide the tools needed for day-to-day logistics.

### 📝 Prompt 7: Bulk ID Card Generator
> "Implement the 'ID Card Studio' module:
> 1. Create a page where users select a Class and Section.
> 2. Logic: Generate a grid layout (8-10 cards per A4 page) using CSS print media queries.
> 3. Design: Modern vertical ID card with Student Photo, Name, Roll No, Blood Group, and a QR code linking to their profile."

---

## Phase 6: System Reliability & Local Deployment
**Goal:** Protect the data on a local machine and ensure easy setup.

### 📝 Prompt 8: Automated Data Safeguard (Backup)
> "Build the 'Institutional Safety' module:
> 1. **Backend Utility:** Create a script using `child_process` to run a database dump (SQL file).
> 2. **Settings:** Allow the admin to specify a 'Backup Path' (e.g., a USB drive).
> 3. **Automation:** Implement a Cron job (if server is running) or a startup check to auto-backup the database every 24 hours."

### 📝 Prompt 9: One-Click Installer & Local Network Access
> "Create a 'Deployment Kit' for non-technical users:
> 1. **Setup Script:** Write a PowerShell script that checks for Node.js, installs dependencies, runs migrations, and starts the server.
> 2. **Networking:** Implement logic to detect the PC's Local IP (e.g., 192.168.1.15).
> 3. **Shortcut Creator:** Generate a desktop shortcut that opens the browser to that Local IP, allowing other computers in the school to access the ERP over Wi-Fi."

---

## Phase 7: Granular Access Control (RBAC)
**Goal:** Secure the system for different types of employees.

### 📝 Prompt 10: Enterprise Role Permissions
> "Implement strict role-based access across the ERP:
> 1. Update the sidebar to hide/show links based on roles:
>    - **Accountant:** Only Fees & Payments.
>    - **Librarian:** Only Books & Issuance.
>    - **Teacher:** Only Students, Attendance, Marks, & Papers.
>    - **Principal:** All Reports (View only, no delete).
> 2. Update `auth.middleware.ts` to verify these permissions on every API request."

---
*Created for the EduTracker Enterprise Transition - 2026*
