export const generateSalarySlipHtml = (record: any, schoolProfile: any) => {
  const { user, month, year, baseSalary, allowances, deductions, netPay, paymentDate, paymentMethod, status } = record;
  const schoolName = schoolProfile?.name || 'EduTrack Academy';
  const schoolAddress = schoolProfile?.address || '';
  const schoolPhone = schoolProfile?.phone || '';
  const schoolEmail = schoolProfile?.email || '';
  const schoolLogo = schoolProfile?.logo;

  const monthName = new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });

  // Fix logo path
  let logoHtml = '';
  if (schoolLogo) {
    const fullLogoUrl = schoolLogo.startsWith('http') 
      ? schoolLogo 
      : `${process.env.BACKEND_URL || 'http://localhost:5000'}${schoolLogo.startsWith('/') ? '' : '/'}${schoolLogo}`;
    logoHtml = `<img src="${fullLogoUrl}" alt="Logo" style="max-height: 70px; width: auto;" />`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 30px; line-height: 1.4; }
        .slip-wrapper { border: 1px solid #ccc; padding: 20px; max-width: 800px; margin: 0 auto; }
        .header { display: table; width: 100%; border-bottom: 2px solid #444; padding-bottom: 10px; margin-bottom: 20px; }
        .header-left { display: table-cell; vertical-align: middle; width: 80px; }
        .header-right { display: table-cell; vertical-align: middle; padding-left: 20px; }
        .header-right h1 { margin: 0; color: #1a365d; font-size: 24px; text-transform: uppercase; }
        .header-right p { margin: 2px 0; font-size: 12px; color: #666; }
        
        .title-bar { background: #f0f4f8; text-align: center; padding: 10px; font-weight: bold; font-size: 18px; color: #2c5282; margin-bottom: 20px; border: 1px solid #e2e8f0; }
        
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .info-table td { padding: 5px; font-size: 13px; width: 50%; }
        .label { font-weight: bold; color: #4a5568; }
        
        .salary-container { display: table; width: 100%; border-collapse: collapse; }
        .salary-section { display: table-cell; width: 50%; vertical-align: top; border: 1px solid #e2e8f0; }
        .section-header { background: #edf2f7; padding: 8px; font-weight: bold; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
        
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table td { padding: 10px; font-size: 13px; border-bottom: 1px solid #f7fafc; }
        .text-right { text-align: right; }
        
        .summary-box { margin-top: 20px; background: #2d3748; color: white; padding: 15px; border-radius: 4px; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; }
        .net-pay-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .net-pay-value { font-size: 24px; font-weight: bold; }
        
        .footer { margin-top: 60px; display: table; width: 100%; }
        .sig-box { display: table-cell; width: 50%; text-align: center; }
        .sig-line { width: 150px; border-top: 1px solid #000; margin: 0 auto 5px; }
        .sig-text { font-size: 11px; font-weight: bold; color: #718096; }

        .text-green { color: #38a169; }
        .text-red { color: #e53e3e; }
    </style>
</head>
<body>
    <div class="slip-wrapper">
        <div class="header">
            <div class="header-left">${logoHtml}</div>
            <div class="header-right">
                <h1>${schoolName}</h1>
                <p>${schoolAddress}</p>
                <p>Phone: ${schoolPhone} | Email: ${schoolEmail}</p>
            </div>
        </div>

        <div class="title-bar">Payslip for ${monthName} ${year}</div>

        <table class="info-table">
            <tr>
                <td><span class="label">Employee Name:</span> ${user.name}</td>
                <td><span class="label">Payment Date:</span> ${paymentDate ? new Date(paymentDate).toLocaleDateString() : 'Pending'}</td>
            </tr>
            <tr>
                <td><span class="label">Designation:</span> ${user.role}</td>
                <td><span class="label">Payment Method:</span> ${paymentMethod || 'Bank Transfer'}</td>
            </tr>
            <tr>
                <td><span class="label">Employee ID:</span> EMP-${user.id.toString().padStart(4, '0')}</td>
                <td><span class="label">Status:</span> <span style="color: ${status === 'PAID' ? 'green' : 'orange'}">${status}</span></td>
            </tr>
        </table>

        <div style="display: flex; gap: 20px;">
            <div style="flex: 1; border: 1px solid #e2e8f0;">
                <div class="section-header">EARNINGS</div>
                <table class="data-table">
                    <tr>
                        <td>Basic Salary</td>
                        <td class="text-right">$${baseSalary.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Allowances</td>
                        <td class="text-right text-green">+$${allowances.toLocaleString()}</td>
                    </tr>
                    <tr style="height: 40px;"><td></td><td></td></tr>
                </table>
            </div>
            <div style="flex: 1; border: 1px solid #e2e8f0;">
                <div class="section-header">DEDUCTIONS</div>
                <table class="data-table">
                    <tr>
                        <td>Attendance Deductions</td>
                        <td class="text-right text-red">-$${deductions.toLocaleString()}</td>
                    </tr>
                    <tr style="height: 80px;"><td></td><td></td></tr>
                </table>
            </div>
        </div>

        <div class="summary-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="net-pay-label">Net Take Home Pay</span>
                <span class="net-pay-value">$${netPay.toLocaleString()}</span>
            </div>
        </div>

        <div class="footer">
            <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-text">Employee Signature</div>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-text">Authorized Signatory</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};
