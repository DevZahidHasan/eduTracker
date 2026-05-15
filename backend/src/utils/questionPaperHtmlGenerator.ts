export const generateQuestionPaperHtml = (paper: any, schoolProfile: any) => {
  const schoolName = schoolProfile?.name || 'EduTrack Academy';
  const schoolAddress = schoolProfile?.address || '';
  const schoolPhone = schoolProfile?.phone || '';
  const schoolEmail = schoolProfile?.email || '';
  const schoolLogo = schoolProfile?.logo;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${paper.title} - Print</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
            background-color: #f8fafc;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            padding: 60px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 8px;
        }
        .action-buttons-container {
            text-align: right;
            margin-bottom: 30px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .action-btn {
            background-color: #2563eb;
            color: #fff;
            border: none;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 6px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            transition: background-color 0.2s;
        }
        .action-btn:hover {
            background-color: #1d4ed8;
        }
        .action-btn:disabled {
            background-color: #94a3b8;
            cursor: not-allowed;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 24px;
            margin-bottom: 32px;
            text-align: center;
        }
        .school-logo {
            max-height: 80px;
            width: auto;
        }
        .school-info h1 {
            margin: 0;
            font-size: 24px;
            color: #0f172a;
            letter-spacing: -0.025em;
            text-transform: uppercase;
        }
        .school-info p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: #64748b;
        }
        .paper-title {
            text-align: center;
            margin-bottom: 32px;
        }
        .paper-title h2 {
            margin: 0;
            font-size: 20px;
            color: #1e293b;
            text-decoration: underline;
            text-underline-offset: 4px;
        }
        .meta-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 32px;
            padding: 20px;
            background-color: #f1f5f9;
            border-radius: 6px;
            font-size: 14px;
        }
        .meta-info div {
            display: flex;
            gap: 8px;
        }
        .meta-info span.label {
            font-weight: 700;
            color: #475569;
            min-width: 100px;
        }
        .instructions {
            border: 1.5px dashed #cbd5e1;
            padding: 20px;
            margin-bottom: 40px;
            background-color: #fff;
            border-radius: 6px;
            font-size: 13px;
        }
        .instructions strong {
            display: block;
            margin-bottom: 8px;
            color: #334155;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.05em;
        }
        .question {
            margin-bottom: 32px;
            page-break-inside: avoid;
        }
        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 15px;
        }
        .question-text {
            flex: 1;
            padding-right: 20px;
        }
        .marks {
            white-space: nowrap;
            color: #64748b;
            font-size: 13px;
        }
        .options {
            list-style-type: lower-alpha;
            margin-left: 40px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }
        .options li {
            margin-bottom: 4px;
            font-size: 14px;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #94a3b8;
            font-weight: 600;
        }
        
        @media print {
            body {
                background-color: #fff;
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 0;
                max-width: 100%;
            }
            .action-buttons-container {
                display: none;
            }
            @page {
                margin: 1.5cm;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="action-buttons-container">
            <button class="action-btn" onclick="window.print()">Print Paper</button>
            <button class="action-btn" id="downloadPdfBtn" onclick="downloadPdf('${paper.id}')">Export as PDF</button>
        </div>
        
        <div class="header">
            ${schoolLogo ? `<img src="${schoolLogo}" alt="Logo" class="school-logo" />` : ''}
            <div class="school-info">
                <h1>${schoolName}</h1>
                <p>${schoolAddress}${schoolPhone ? ' • ' + schoolPhone : ''}</p>
                <p>${schoolEmail}${schoolProfile?.website ? ' • ' + schoolProfile.website : ''}</p>
            </div>
        </div>

        <div class="paper-title">
            <h2>${paper.title}</h2>
        </div>
        
        <div class="meta-info">
            <div><span class="label">Class:</span> <span>${paper.className} ${paper.section ? '(Section ' + paper.section + ')' : ''}</span></div>
            <div><span class="label">Subject:</span> <span>${paper.subject}</span></div>
            <div><span class="label">Exam Type:</span> <span>${paper.examType.replace(/_/g, ' ')}</span></div>
            <div><span class="label">Date:</span> <span>${paper.examDate ? new Date(paper.examDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</span></div>
            <div><span class="label">Duration:</span> <span>${paper.duration} Minutes</span></div>
            <div><span class="label">Total Marks:</span> <span>${paper.totalMarks} Marks</span></div>
        </div>
        
        ${paper.instructions ? `
        <div class="instructions">
            <strong>General Instructions:</strong>
            ${paper.instructions.replace(/\\n/g, '<br/>')}
        </div>
        ` : ''}
        
        <div class="questions">
            ${paper.questions.map((q: any, index: number) => `
                <div class="question">
                    <div class="question-header">
                        <span class="question-text">Q${index + 1}. ${q.questionText}</span>
                        <span class="marks">[${q.marks} Marks]</span>
                    </div>
                    ${q.instructions ? `<div style="font-style: italic; font-size: 13px; color: #64748b; margin-bottom: 8px; margin-left: 20px;">Note: ${q.instructions}</div>` : ''}
                    ${q.options && q.options.length > 0 ? `
                        <ol class="options">
                            ${q.options.map((opt: string) => `<li>${opt}</li>`).join('')}
                        </ol>
                    ` : '<div style="margin-top: 16px; min-height: 40px; border-bottom: 1px solid #f1f5f9;"></div>'}
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <span>*** END OF EXAMINATION PAPER ***</span>
            <span>Generated by EduTracker ERP</span>
        </div>
    </div>
    
    <script>
        async function downloadPdf(id) {
            const btn = document.getElementById('downloadPdfBtn');
            const originalText = btn.innerText;
            btn.innerText = 'Generating PDF...';
            btn.disabled = true;
            
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token') || localStorage.getItem('token');
                
                const headers = {};
                if (token) {
                    headers['Authorization'] = 'Bearer ' + token;
                }
                
                const fetchUrl = '/api/question-papers/' + id + '/export/pdf' + (token ? '?token=' + encodeURIComponent(token) : '');
                
                const response = await fetch(fetchUrl, { headers });
                
                if (!response.ok) {
                    const fallbackUrl = '/question-papers/' + id + '/export/pdf' + (token ? '?token=' + encodeURIComponent(token) : '');
                    const fallbackResponse = await fetch(fallbackUrl, { headers });
                    if (!fallbackResponse.ok) {
                        throw new Error('Failed to generate PDF. Status: ' + response.status);
                    }
                    return await processPdfResponse(fallbackResponse, id);
                }
                
                await processPdfResponse(response, id);
            } catch (error) {
                console.error('Error downloading PDF:', error);
                alert('Error downloading PDF. Please check your authentication or try again.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
        
        async function processPdfResponse(response, id) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = '${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_' + id + '.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    </script>
</body>
</html>
  `;
};