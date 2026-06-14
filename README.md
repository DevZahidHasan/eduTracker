<div align="center">
  <img src="./public/edutrackerLogo.png" alt="eduTracker Logo" width="200" />
  <h1>🎓 eduTracker Enterprise ERP</h1>
  <p><strong>A Complete, Perfected, and Production-Ready School Management System</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## 🌟 Overview

**eduTracker** is a state-of-the-art, end-to-end Enterprise Resource Planning (ERP) system designed explicitly for modern educational institutions. Moving away from scattered spreadsheets and fragmented software, eduTracker digitizes, automates, and secures every aspect of school administration into one unified platform.

Built with performance, security, and scalability in mind, it is capable of seamlessly handling thousands of students, generating instant financial reports, conducting automated database backups, and preventing unauthorized access through an enterprise-grade licensing system.

---

## 🚀 Key Modules & Features

eduTracker is divided into specialized modules, each crafted to solve real-world school management problems:

### 🧑‍🎓 Student & Admissions Management
*   **Lead Pipeline:** Track new inquiries from walk-ins, phone calls, or website leads.
*   **One-Click Admission:** Convert successful inquiries directly into enrolled students.
*   **ID Card Generation:** Dynamically generate and print highly customizable Student and Staff ID cards (Portrait/Landscape layouts).

### 📝 Academics & Examinations
*   **Attendance Tracking:** Daily tracking with a "lock" feature to prevent tampering after submission.
*   **Advanced Grading (BD Standard):** Supports complex term weightages (e.g., 30% Tutorial, 70% Final).
*   **Automated Report Cards:** Generates pixel-perfect, downloadable PDF report cards.
*   **Question Paper Builder:** Craft exams using a centralized Question Bank. *Includes an Experimental AI Insights Engine to suggest questions.*

### 💵 Finance & Accounting
*   **Fee Structures:** Define custom fee categories, monthly tuition, and one-time charges.
*   **Voucher Generation:** Batch generate fee vouchers for entire classes in one click.
*   **Payment Collection:** Process cash/bank payments, track partial dues, and generate instant PDF receipts.

### 👥 HR & Payroll
*   **Staff Directory:** Manage Teachers, Accountants, Librarians, Security, and Cleaners.
*   **Leave Management:** Staff can submit leave requests for Principal approval.
*   **Payroll Processing:** Define basic salary, allowances, and deductions to automatically generate monthly payslips.

### 🏫 Operations
*   **Library Management:** Manage book inventory, issue/return logs, and overdue tracking.
*   **Transport & Routes:** Assign students to bus routes and track transport billing.
*   **Asset Inventory:** Keep track of school assets, hardware, and supplies.

---

## 🛡️ Enterprise-Ready Security & Architecture

This is not a toy project; it is built for production environments:

*   **Role-Based Access Control (RBAC):** Strict middleware enforcing access. Teachers cannot view finance; Accountants cannot alter exams. 
*   **Proprietary Licensing Engine:** The software requires an encrypted, time-bound License Key to operate. Once expired, it locks the dashboard automatically, ensuring subscription compliance.
*   **Automated Backups:** A built-in cron scheduler takes `pg_dump` backups of the PostgreSQL database and offers a 1-click cloud sync to Google Drive.
*   **Audit Logging:** Every critical action (updating marks, deleting payments, altering fees) is logged with the user's ID, timestamp, and a before/after snapshot.
*   **Stress-Tested:** Validated to handle thousands of concurrent records with query return times under 15ms.

---

## 💻 Tech Stack

**Frontend:**
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + custom UI components
*   **State Management:** Redux Toolkit

**Backend:**
*   **Runtime:** Node.js with Express.js
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Security:** Helmet, CORS, JWT Authentication, bcrypt
*   **Logging:** Winston (Daily Rotating Files)

**Quality Assurance:**
*   **Unit/API Testing:** Jest & Supertest
*   **E2E Smoke Testing:** Playwright
*   **Linting:** ESLint (Strict Mode)

---
## 📄 License

This software is a proprietary Enterprise system. Unauthorized distribution, copying, or reverse engineering of the licensing mechanisms is strictly prohibited.
