export const generateQuestionPaperHtml = (paper: any, schoolName: string) => {
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
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f9;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .action-buttons-container {
            text-align: right;
            margin-bottom: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .action-btn {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
        }
        .action-btn:hover {
            background-color: #0056b3;
        }
        .action-btn:disabled {
            background-color: #a0c4ff;
            cursor: not-allowed;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .meta-info {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .meta-info div {
            flex-basis: 48%;
            margin-bottom: 10px;
        }
        .instructions {
            border: 1px solid #ccc;
            padding: 15px;
            margin-bottom: 25px;
            background-color: #fafafa;
        }
        .question {
            margin-bottom: 20px;
        }
        .question-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .options {
            list-style-type: lower-alpha;
            margin-left: 20px;
        }
        .options li {
            margin-bottom: 5px;
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
                margin: 2cm;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="action-buttons-container">
            <button class="action-btn" onclick="window.print()">Print</button>
            <button class="action-btn" id="downloadPdfBtn" onclick="downloadPdf('${paper.id}')">Download PDF</button>
        </div>
        
        <div class="header">
            <h1>${schoolName}</h1>
            <h2>${paper.title}</h2>
        </div>
        
        <div class="meta-info">
            <div>Class: ${paper.className} ${paper.section ? '- ' + paper.section : ''}</div>
            <div>Subject: ${paper.subject}</div>
            <div>Exam Type: ${paper.examType}</div>
            <div>Date: ${new Date(paper.examDate).toLocaleDateString()}</div>
            <div>Duration: ${paper.duration} minutes</div>
            <div>Total Marks: ${paper.totalMarks}</div>
        </div>
        
        ${paper.instructions ? `
        <div class="instructions">
            <strong>General Instructions:</strong><br/>
            ${paper.instructions.replace(/\\n/g, '<br/>')}
        </div>
        ` : ''}
        
        <div class="questions">
            ${paper.questions.map((q: any, index: number) => `
                <div class="question">
                    <div class="question-header">
                        <span>Q${index + 1}. ${q.questionText}</span>
                        <span>[${q.marks} Marks]</span>
                    </div>
                    ${q.instructions ? `<div style="font-style: italic; margin-bottom: 5px;">${q.instructions}</div>` : ''}
                    ${q.options && q.options.length > 0 ? `
                        <ol class="options">
                            ${q.options.map((opt: string) => `<li>${opt}</li>`).join('')}
                        </ol>
                    ` : '<div style="margin-top: 10px; min-height: 50px;"></div>'}
                </div>
            `).join('')}
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
                
                // Adjusting the URL to be robust whether called from frontend proxy or directly
                const fetchUrl = '/api/question-papers/' + id + '/export/pdf' + (token ? '?token=' + encodeURIComponent(token) : '');
                
                const response = await fetch(fetchUrl, { headers });
                
                if (!response.ok) {
                    // Try without /api prefix if it fails (in case the proxy mounts it differently)
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