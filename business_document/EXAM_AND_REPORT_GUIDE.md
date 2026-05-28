# eduTracker Exam, Marking, and Reporting Guide

This document is for **School Administrators and Principals**. It explains how to configure and use the advanced academic module to manage everything from daily class tests to final annual report cards.

---

## 1. Overview of the Module

eduTracker's academic module is built to be 100% dynamic, supporting the standard **Bangladesh School Marking System**. It allows institutions to define their own grading scales, exam types, and weighted averages.

**Key Capabilities:**
*   **Weighted Grading:** Mix Tutorial (30%) and Term Exams (70%) automatically.
*   **Dynamic Structure:** Choose between a 2-term (Semester) or 3-term (Trimester) year.
*   **One-Click Annual Reports:** Instant compilation of a whole year's data into a single official document.
*   **Flexible Scaling:** Customizable passing marks and GPA points per school policy.

---

## 2. Configuration (Setting the Rules)

Before teachers enter marks, the Administrator must set the institution's rules in **Settings > Academic Settings**.

### Step A: Grade Scale
Define what marks constitute an A+, A, or F.
1.  Go to **Grade Scale**.
2.  Add rules (e.g., Min 80% = A+ (5.0 Points), Min 0% = F (0 Points)).
3.  The system uses these percentages to automatically assign grades across all exam types.

### Step B: Assessment Types (The 30/70 Rule)
For each term, you should define at least two assessment types:
1.  **Tutorial / Class Test (CT):**
    *   Set **Category** to `TUTORIAL`.
    *   Set **Base Mark** to `30`.
    *   Assign it to **Term 1**.
2.  **Term Final Exam:**
    *   Set **Category** to `FINAL`.
    *   Set **Base Mark** to `70`.
    *   Assign it to **Term 1**.

---

## 3. Workflow (How Schools Use It)

### Phase 1: Data Entry (Teachers)
Teachers navigate to the **Academic Grading** (Marks) page.
*   They select the Class, Subject, and the specific Assessment (e.g., "Term 1 Tutorial").
*   The system provides a clean list of students.
*   As marks are entered, the system shows real-time grade previews (e.g., entering 25/30 shows an immediate status).

### Phase 2: Term Report Generation
Once all marks (Tutorial and Final) are entered for a term:
1.  Navigate to the **Reporting Center**.
2.  Select the **Term X Report (BD Standard)** option.
3.  The system automatically generates a multi-column report showing:
    *   Subject Name | Tutorial Mark | Final Exam Mark | Total (100) | Grade

### Phase 3: Annual Master Report
At the end of the year, the Principal can generate a master report:
1.  Click **"Compile Annual Result"**.
2.  The system reads every mark from Term 1, 2, and 3.
3.  It applies the weightages (e.g., Term 1 = 30%, Term 2 = 30%, Term 3 = 40%).
4.  It produces a high-fidelity **Annual Master Report** showing the student's complete academic journey.

---

## 4. Administrative Features

### Deleting Records
If a mistake is made or a subject is no longer taught:
*   Administrators can delete Classes, Subjects, or Exam Types directly from the settings.
*   **Warning:** Deleting an exam type will also remove all marks associated with that exam.

### System Scalability
*   **Any Mark Range:** The system handles tests out of 10, 20, 50, or 100 marks by normalizing them to percentages.
*   **Print Ready:** Every report is formatted to fit standard A4 paper with the institution's official logo and branding.

---

*For technical support or feature requests regarding the reporting engine, please contact the EduTracker AI Development Team.*
