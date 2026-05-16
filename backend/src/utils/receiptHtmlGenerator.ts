export const generateReceiptHtml = (voucher: any, schoolProfile: any) => {
  const { student, payments, items, totalAmount, paidAmount, status, month, year, id: voucherId } = voucher;
  const schoolName = schoolProfile?.name || 'EduTrack Academy';
  const schoolAddress = schoolProfile?.address || '';
  const schoolPhone = schoolProfile?.phone || '';
  const schoolEmail = schoolProfile?.email || '';
  const schoolLogo = schoolProfile?.logo;
  const academicYear = schoolProfile?.academicYear || '2026-2027';

  const monthName = new Date(0, month - 1).toLocaleString('default', { month: 'long' });

  const renderReceiptCopy = (title: string) => `
    <div class="receipt-copy">
      <div class="header">
        ${schoolLogo ? `<img src="${schoolLogo}" alt="Logo" class="school-logo" />` : ''}
        <div class="school-info">
          <h1>${schoolName}</h1>
          <p>${schoolAddress}</p>
          <p>Phone: ${schoolPhone} | Email: ${schoolEmail}</p>
        </div>
      </div>

      <div class="receipt-meta">
        <div class="copy-title">${title}</div>
        <div class="voucher-id">Voucher #: ${voucherId.substring(0, 8).toUpperCase()}</div>
      </div>

      <div class="student-box">
        <div class="info-grid">
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">${student.fullName}</span>
          </div>
          <div class="info-row">
            <span class="label">Student ID:</span>
            <span class="value">${student.studentId}</span>
          </div>
          <div class="info-row">
            <span class="label">Class:</span>
            <span class="value">${student.className}-${student.section}</span>
          </div>
          <div class="info-row">
            <span class="label">Period:</span>
            <span class="value">${monthName} ${year}</span>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item: any) => `
            <tr>
              <td>${item.feeType.name}</td>
              <td class="text-right">$${item.amount.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td>TOTAL AMOUNT</td>
            <td class="text-right">$${totalAmount.toLocaleString()}</td>
          </tr>
          <tr class="paid-row">
            <td>AMOUNT PAID</td>
            <td class="text-right">$${paidAmount.toLocaleString()}</td>
          </tr>
          <tr class="balance-row">
            <td>BALANCE DUE</td>
            <td class="text-right">$${(totalAmount - paidAmount).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <div class="payment-history">
        <h3>Recent Payments</h3>
        ${payments.length > 0 ? `
          <ul>
            ${payments.map((p: any) => `
              <li>${new Date(p.paymentDate).toLocaleDateString()} - ${p.paymentMethod} - <strong>$${p.amount.toLocaleString()}</strong></li>
            `).join('')}
          </ul>
        ` : '<p>No payments recorded yet.</p>'}
      </div>

      <div class="footer">
        <div class="status-stamp ${status.toLowerCase()}">${status}</div>
        <div class="signature-area">
          <div class="sig-line"></div>
          <p>Authorized Signature</p>
        </div>
      </div>
    </div>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fee Receipt - ${student.fullName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }
        .page-container {
            width: 210mm;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
        }
        .receipt-copy {
            width: 100%;
            padding: 15mm;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            flex-direction: column;
            position: relative;
            page-break-inside: auto;
            min-height: auto;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 20px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .school-logo {
            max-height: 50px;
            width: auto;
        }
        .school-info h1 {
            margin: 0;
            font-size: 20px;
            color: #1e3a8a;
            text-transform: uppercase;
        }
        .school-info p {
            margin: 1px 0;
            font-size: 11px;
            color: #64748b;
        }
        .receipt-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .copy-title {
            font-weight: 900;
            font-size: 12px;
            background: #eff6ff;
            color: #1e40af;
            padding: 4px 10px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .voucher-id {
            font-family: monospace;
            font-size: 11px;
            color: #94a3b8;
        }
        .student-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }
        .info-row {
            display: flex;
            gap: 8px;
            font-size: 12px;
        }
        .label {
            font-weight: 700;
            color: #64748b;
            min-width: 80px;
        }
        .value {
            color: #1e293b;
            font-weight: 800;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 12px;
        }
        th {
            background-color: #f1f5f9;
            color: #475569;
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #f1f5f9;
        }
        .text-right { text-align: right; }
        .total-row { font-weight: 700; background: #f8fafc; }
        .paid-row { color: #059669; font-weight: 700; }
        .balance-row { font-weight: 900; color: #1e3a8a; font-size: 14px; border-top: 2px solid #e2e8f0; }
        
        .payment-history {
            margin-top: 5px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
        .payment-history h3 {
            margin: 0 0 5px 0;
            font-size: 10px;
            text-transform: uppercase;
            color: #94a3b8;
        }
        .payment-history ul {
            margin: 0;
            padding-left: 15px;
            font-size: 11px;
            color: #64748b;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            page-break-inside: avoid;
        }
        .status-stamp {
            border: 3px solid;
            padding: 5px 15px;
            font-weight: 900;
            font-size: 18px;
            text-transform: uppercase;
            border-radius: 8px;
            transform: rotate(-5deg);
            opacity: 0.1;
        }
        .status-stamp.paid { border-color: #059669; color: #059669; }
        .status-stamp.unpaid { border-color: #ef4444; color: #ef4444; }
        .status-stamp.partial { border-color: #3b82f6; color: #3b82f6; }
        
        .signature-area {
            text-align: center;
            width: 150px;
        }
        .sig-line {
            border-top: 1px solid #1e293b;
            margin-bottom: 5px;
        }
        .signature-area p {
            margin: 0;
            font-size: 10px;
            font-weight: 700;
            color: #475569;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        @media print {
            body { background: #fff; }
            .page-container { width: 100%; padding: 0; }
            .receipt-copy { 
                box-shadow: none; 
                border: none; 
                padding: 10mm;
            }
        }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="page-break">
            ${renderReceiptCopy('Office Copy')}
        </div>
        <div>
            ${renderReceiptCopy('Student Copy')}
        </div>
    </div>
</body>
</html>
  `;
};
