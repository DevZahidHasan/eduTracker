"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportCardHtml = exports.reportCardStyles = void 0;
exports.reportCardStyles = `
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
            background-color: #f1f5f9;
        }
        .report-card {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 40px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            position: relative;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .school-logo {
            max-height: 70px;
            width: auto;
        }
        .school-info h1 {
            margin: 0;
            font-size: 28px;
            color: #1e3a8a;
            text-transform: uppercase;
        }
        .school-info p {
            margin: 2px 0;
            font-size: 13px;
            color: #64748b;
        }
        .report-title {
            text-align: center;
            margin-bottom: 30px;
        }
        .report-title h2 {
            margin: 0;
            font-size: 22px;
            color: #1e293b;
            background: #eff6ff;
            padding: 10px;
            border-radius: 4px;
            display: inline-block;
        }
        .student-profile {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .student-info {
            flex: 1;
        }
        .student-photo {
            width: 100px;
            height: 120px;
            border: 2px solid #e2e8f0;
            border-radius: 4px;
            object-fit: cover;
            background: #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #94a3b8;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            font-size: 14px;
        }
        .info-item {
            display: flex;
            gap: 8px;
        }
        .info-label {
            font-weight: 700;
            color: #475569;
            min-width: 100px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background-color: #1e40af;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 14px;
            text-transform: uppercase;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .summary-box {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        .summary-item {
            background: #f1f5f9;
            padding: 15px;
            text-align: center;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .summary-label {
            display: block;
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .summary-value {
            display: block;
            font-size: 20px;
            font-weight: 800;
            color: #1e3a8a;
        }
        .remarks-section {
            margin-bottom: 40px;
        }
        .remarks-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 8px;
            text-transform: uppercase;
            border-left: 4px solid #3b82f6;
            padding-left: 10px;
        }
        .remarks-content {
            background: #fff;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 14px;
            font-style: italic;
            color: #334155;
            min-height: 60px;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 20px;
        }
        .sig-box {
            text-align: center;
            width: 200px;
        }
        .sig-line {
            border-top: 1px solid #1e293b;
            margin-bottom: 8px;
        }
        .sig-label {
            font-size: 12px;
            font-weight: 700;
            color: #475569;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0, 0, 0, 0.03);
            pointer-events: none;
            z-index: 0;
            text-transform: uppercase;
            font-weight: 900;
            white-space: nowrap;
        }
        .action-bar {
            text-align: right;
            margin-bottom: 20px;
        }
        .btn-print {
            background: #2563eb;
            color: #fff;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }
        @media print {
            body { background: #fff; padding: 0; }
            .report-card { box-shadow: none; border: 2px solid #e2e8f0; max-width: 100%; }
            .action-bar { display: none; }
            @page { margin: 1cm; }
        }
    </style>
`;
const generateReportCardHtml = (data, schoolProfile) => {
    var _a;
    const { student, marks, gpa, grade, attendanceRate, teacherRemarks, aiInsights } = data;
    const schoolName = (schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.name) || 'EduTrack Academy';
    const schoolAddress = (schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.address) || '';
    const schoolPhone = (schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.phone) || '';
    const schoolEmail = (schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.email) || '';
    const schoolLogo = schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.logo;
    const academicYear = (schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.academicYear) || '2026-2027';
    const obtainedMarks = marks.reduce((acc, m) => acc + m.score, 0);
    const totalMax = marks.reduce((acc, m) => acc + m.maxScore, 0);
    const percentage = totalMax > 0 ? (obtainedMarks / totalMax) * 100 : 0;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Card - ${student.fullName}</title>
    ${exports.reportCardStyles}
</head>
<body>
    <div class="action-bar">
        <button class="btn-print" onclick="window.print()">Print Report Card</button>
    </div>

    <div class="report-card">
        <div class="watermark">${schoolName}</div>
        
        <div class="header">
            ${schoolLogo ? `<img src="${schoolLogo}" alt="Logo" class="school-logo" />` : ''}
            <div class="school-info">
                <h1>${schoolName}</h1>
                <p>${schoolAddress}</p>
                <p>Phone: ${schoolPhone} | Email: ${schoolEmail}</p>
                <p>Academic Year: ${academicYear}</p>
            </div>
        </div>

        <div class="report-title">
            <h2>ACADEMIC PROGRESS REPORT</h2>
        </div>

        <div class="student-profile">
            <div class="student-info">
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Student Name:</span> <span>${student.fullName}</span></div>
                    <div class="info-item"><span class="info-label">Roll Number:</span> <span>${student.rollNumber}</span></div>
                    <div class="info-item"><span class="info-label">Student ID:</span> <span>${student.studentId}</span></div>
                    <div class="info-item"><span class="info-label">Class:</span> <span>${student.className}</span></div>
                    <div class="info-item"><span class="info-label">Section:</span> <span>${student.section}</span></div>
                    <div class="info-item"><span class="info-label">Gender:</span> <span>${student.gender}</span></div>
                </div>
            </div>
            <div class="student-photo">
                ${student.profileImage ? `<img src="${student.profileImage}" style="width:100%; height:100%; object-fit:cover;" />` : 'NO PHOTO'}
            </div>
        </div>

        <table style="width:100%; table-layout: fixed; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="width: 25%; text-align:left;">Subject</th>
                    ${data.isBDStandard ? `
                        <th style="width: 15%; text-align:center;">Tutorial</th>
                        <th style="width: 15%; text-align:center;">Final Exam</th>
                    ` : ''}
                    ${data.isAnnual && data.contributingTerms ? `
                        ${data.contributingTerms.map((t) => `<th style="text-align:center; font-size:10px;">${t.label}</th>`).join('')}
                    ` : ''}
                    <th style="width: 15%; text-align:center;">${data.isAnnual ? 'Average' : 'Total'}</th>
                    <th style="width: 10%; text-align:center;">GP</th>
                    <th style="width: 10%; text-align:center;">Grade</th>
                </tr>
            </thead>
            <tbody style="font-size: 12px;">
                ${marks.map((m) => {
        var _a, _b, _c;
        return `
                    <tr>
                        <td style="font-weight:600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.subject.replace(/_/g, ' ')}</td>
                        ${data.isBDStandard ? `
                            <td style="text-align:center;">${(_a = m.tutorial) !== null && _a !== void 0 ? _a : '-'}</td>
                            <td style="text-align:center;">${(_b = m.final) !== null && _b !== void 0 ? _b : '-'}</td>
                        ` : ''}
                        ${data.isAnnual && data.contributingTerms ? `
                            ${data.contributingTerms.map((t) => { var _a, _b; return `<td style="text-align:center;">${(_b = (_a = m.termScores) === null || _a === void 0 ? void 0 : _a[t.value]) !== null && _b !== void 0 ? _b : '-'}</td>`; }).join('')}
                        ` : ''}
                        <td style="text-align:center; font-weight:700;">${m.score}</td>
                        <td style="text-align:center; font-weight:700;">${((_c = m.gpa) === null || _c === void 0 ? void 0 : _c.toFixed(2)) || '0.00'}</td>
                        <td style="text-align:center; font-weight:700;">${m.grade || '-'}</td>
                    </tr>
                `;
    }).join('')}
            </tbody>
            ${(data.isAnnual || data.isBDStandard) ? `
            <tfoot style="background-color: #f8fafc; font-weight: bold;">
                <tr>
                    <td colspan="${data.isAnnual ? (1 + (((_a = data.contributingTerms) === null || _a === void 0 ? void 0 : _a.length) || 0)) : 3}" style="text-align:right; text-transform:uppercase; font-size:10px;">Grade Point Average (GPA)</td>
                    <td colspan="3" style="text-align:center; font-size:16px; color:#1e3a8a;">${gpa.toFixed(2)}</td>
                </tr>
            </tfoot>
            ` : ''}
        </table>

        <div class="summary-box">
            <div class="summary-item">
                <span class="summary-label">Total Marks</span>
                <span class="summary-value">${obtainedMarks.toFixed(1)} / ${totalMax}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Percentage</span>
                <span class="summary-value">${percentage.toFixed(2)}%</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">GPA</span>
                <span class="summary-value">${gpa.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Overall Grade</span>
                <span class="summary-value">${grade}</span>
            </div>
        </div>

        <div class="summary-box" style="grid-template-columns: repeat(2, 1fr);">
            <div class="summary-item">
                <span class="summary-label">Attendance Rate</span>
                <span class="summary-value">${attendanceRate}%</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Status</span>
                <span class="summary-value" style="color: ${grade === 'F' ? '#ef4444' : '#10b981'}">${grade === 'F' ? 'FAILED' : 'PASSED'}</span>
            </div>
        </div>

        <div class="remarks-section">
            <div class="remarks-title">Teacher's Remarks</div>
            <div class="remarks-content">${teacherRemarks || 'Satisfactory performance. Keep it up.'}</div>
        </div>

        <div class="remarks-section">
            <div class="remarks-title">AI Performance Insights</div>
            <div class="remarks-content">${aiInsights || 'No insights available.'}</div>
        </div>

        <div class="signatures">
            <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-label">Class Teacher</div>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-label">Parent/Guardian</div>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-label">Principal</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};
exports.generateReportCardHtml = generateReportCardHtml;
