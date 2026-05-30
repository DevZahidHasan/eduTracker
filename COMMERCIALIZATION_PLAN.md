# On-Premise Commercialization Plan

This document outlines the strategic roadmap to transform eduTracker into a professional, highly sellable product tailored for on-premise (self-hosted) client deployments.

## COMPLETED MILESTONES (Archived)
- UI/UX Polish, Animations, and White-labeling
- License Management & Protection
- Automated IIS Deployment & Environment Configuration
- Automated Local Backups & Database Management
- Automated Migrations & Application Updates
- Core Academic Engine (Exam Weightage, Report Cards)
- Robust Data Importers (CSV) for Students/Staff/Books
- Strict Section-Wide Attendance Validation & Locking Mechanism

---

## NEXT PHASE: HIGH-VALUE DEMO FEATURES (The "Wow" Factor)

### 1. Parent Portal & Communication
*Schools buy software that makes them look good to parents.*
- [ ] **Dedicated Parent Dashboard:** Build a specific, mobile-friendly view where parents can log in and instantly see their child's attendance today, upcoming exams, due fees, and latest report cards.
- [ ] **Homework & Assignments Module:** Allow teachers to post daily homework or assignments, with automated push/WhatsApp notifications to parents.
- [ ] **Live Bus Tracking (Transport Enhancement):** Add a feature where parents can see if the bus is delayed (via GPS or manual driver updates).

### 2. Automated Online Payments (Finance)
*Solve the immense struggle of fee collection and tracking.*
- [ ] **Payment Gateway Integration:** Integrate a real payment gateway (like Stripe, Razorpay, or a local provider) into the `FeeVouchers` and `Payments` flow.
- [ ] **Automated Reminders:** Automatically send a WhatsApp or SMS to parents 3 days before a fee is due, containing a secure link to pay instantly on their phone.
- [ ] **Real-time Finance Updates:** Ensure the Admin dashboard updates instantly when a parent completes an online payment.

### 3. Principal's Analytics & AI Insights
*Provide a bird's-eye view of the school's health without spreadsheets.*
- [ ] **The Principal's Command Center:** Create a visually rich dashboard surfacing:
  - **Revenue vs. Dues:** A pie chart of fees collected this month vs. outstanding.
  - **Attendance Trends:** Track which classes have the worst attendance or rising absence rates.
  - **Teacher Performance:** Analyze which subjects have the lowest average grades.
- [ ] **AI-Generated Report Card Comments:** Utilize the `aiInsights` schema to automatically generate personalized, encouraging remarks for report cards based on a student's marks and attendance, saving teachers hours of work.

### 4. Operational Quick-Wins (High Demo Value)
- [ ] **Biometric/RFID Attendance API:** Add a dedicated API endpoint for hardware integration so biometric machines can push attendance automatically.
- [ ] **ID Card & Certificate Generator (Visual Polish):** Utilize the `DocumentTemplate` schema to create a beautiful, drag-and-drop or highly stylized PDF generator for Student ID cards and Transfer Certificates, allowing in-house printing.

### 5. Final Documentation Polish
- [ ] **Restore Documentation:** Write clear instructions for clients on how to restore a database dump from the automated backups.



### 6. Cloud Connectivity & Deployment (The "Hybrid" Setup)
*The final step before selling: Making the on-premise app accessible securely from the internet without touching school routers.*
- [ ] **Cloudflare Tunnel Integration:** Update the `install-iis-server.ps1` script to automatically download, install, and configure `cloudflared` as a Windows Service.
- [ ] **Automated Subdomain Routing:** Build a mechanism (or script) to easily bind a school's local IIS server to a public URL (e.g., `parents.schoolname.com`) via the tunnel.
