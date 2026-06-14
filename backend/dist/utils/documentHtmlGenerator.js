"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificateHtml = exports.generateIDCardHtml = void 0;
const path_1 = __importDefault(require("path"));
const generateIDCardHtml = (students, schoolProfile, config) => {
    const { primaryColor = '#1e40af', secondaryColor = '#ffffff', textColor = '#1e293b', showSchoolAddress = true, showSchoolPhone = true, showExpiryDate = true, layout = 'portrait' // portrait or landscape
     } = config;
    // Use the requested screenshot as fallback
    const rootDir = path_1.default.join(__dirname, '../../../');
    const fallbackPath = 'file://' + path_1.default.join(rootDir, 'Screenshot 2026-05-24 161811.png').replace(/\\/g, '/');
    const cardsHtml = students.map(student => `
    <div class="id-card ${layout}">
      <div class="header" style="background-color: ${primaryColor}; color: ${secondaryColor};">
        ${schoolProfile.logo ? `<img src="${schoolProfile.logo.startsWith('http') ? schoolProfile.logo : 'file://' + schoolProfile.logo.replace(/\\/g, '/')}" class="school-logo" />` : ''}
        <div class="school-name">${schoolProfile.name}</div>
      </div>
      
      <div class="content">
        <div class="photo-container">
          ${student.profileImage
        ? `<img src="${student.profileImage.startsWith('http') ? student.profileImage : 'file://' + student.profileImage.replace(/\\/g, '/')}" class="student-photo" />`
        : `<img src="${fallbackPath}" class="student-photo" />`}
        </div>
        
        <div class="student-info">
          <div class="name">${student.fullName}</div>
          <div class="role">STUDENT</div>
          
          <div class="details">
            <div class="detail-row">
              <span class="label">ID:</span>
              <span class="value">${student.studentId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Class:</span>
              <span class="value">${student.className} - ${student.section}</span>
            </div>
            <div class="detail-row">
              <span class="label">Roll:</span>
              <span class="value">${student.rollNumber}</span>
            </div>
            ${student.phone ? `
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">${student.phone}</span>
            </div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="footer">
        ${showSchoolAddress ? `<div class="address">${schoolProfile.address || ''}</div>` : ''}
        ${showSchoolPhone ? `<div class="phone">Tel: ${schoolProfile.phone || ''}</div>` : ''}
        ${showExpiryDate ? `<div class="expiry">Valid Until: March 2027</div>` : ''}
      </div>
    </div>
  `).join('');
    return `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; margin: 0; padding: 20px; }
          .id-card { 
            width: 2.125in; 
            height: 3.375in; 
            border: 1px solid #ddd; 
            border-radius: 10px; 
            overflow: hidden; 
            display: inline-block; 
            margin: 10px;
            position: relative;
            background: #fff;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .id-card.landscape { width: 3.375in; height: 2.125in; }
          
          .header { padding: 10px; text-align: center; }
          .school-logo { height: 30px; margin-bottom: 5px; }
          .school-name { font-size: 10px; font-weight: bold; text-transform: uppercase; }
          
          .content { padding: 15px 10px; text-align: center; }
          .photo-container { 
            width: 80px; 
            height: 80px; 
            margin: 0 auto 10px; 
            border: 2px solid ${primaryColor};
            border-radius: 50%;
            overflow: hidden;
            background: #f8fafc;
          }
          .student-photo { width: 100%; height: 100%; object-fit: cover; }
          .photo-placeholder { line-height: 80px; font-size: 10px; color: #94a3b8; }
          
          .student-info .name { font-size: 14px; font-weight: bold; color: ${textColor}; margin-bottom: 2px; }
          .student-info .role { font-size: 10px; color: ${primaryColor}; font-weight: bold; letter-spacing: 1px; margin-bottom: 10px; }
          
          .details { text-align: left; font-size: 9px; }
          .detail-row { display: flex; margin-bottom: 3px; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px; }
          .detail-row .label { font-weight: bold; width: 40px; color: #64748b; }
          .detail-row .value { color: #1e293b; }
          
          .footer { 
            position: absolute; 
            bottom: 0; 
            width: 100%; 
            padding: 8px 0; 
            text-align: center; 
            background: #f8fafc; 
            font-size: 7px; 
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          @media print {
            .id-card { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="cards-container">
          ${cardsHtml}
        </div>
      </body>
    </html>
  `;
};
exports.generateIDCardHtml = generateIDCardHtml;
const generateCertificateHtml = (student, schoolProfile, config, extra) => {
    const { primaryColor = '#1e40af', borderStyle = 'double', titleFont = 'Georgia', } = config;
    const { date, issueNumber, type } = extra;
    const title = type === 'LEAVING_CERTIFICATE' ? 'School Leaving Certificate' : 'Character Certificate';
    return `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1e293b; }
          .certificate-border {
            border: 15px ${borderStyle} ${primaryColor};
            padding: 50px;
            height: 8.5in;
            position: relative;
            background: #fff;
          }
          .header { text-align: center; margin-bottom: 40px; }
          .school-logo { height: 80px; margin-bottom: 15px; }
          .school-name { font-size: 32px; font-weight: bold; color: ${primaryColor}; margin-bottom: 5px; }
          .school-info { font-size: 14px; color: #64748b; }
          
          .title-container { text-align: center; margin: 40px 0; }
          .title { 
            font-family: ${titleFont}, serif; 
            font-size: 42px; 
            color: ${primaryColor}; 
            text-transform: uppercase;
            border-bottom: 2px solid ${primaryColor};
            display: inline-block;
            padding-bottom: 10px;
          }
          
          .body { font-size: 18px; line-height: 1.8; text-align: justify; margin-top: 50px; }
          .highlight { font-weight: bold; border-bottom: 1px solid #94a3b8; padding: 0 5px; }
          
          .meta { margin-top: 40px; display: flex; justify-content: space-between; font-size: 14px; }
          
          .signatures { margin-top: 100px; display: flex; justify-content: space-between; }
          .sig-box { text-align: center; width: 200px; }
          .sig-line { border-top: 1px solid #1e293b; margin-top: 50px; padding-top: 10px; font-weight: bold; }
          .principal-sig { height: 60px; margin-bottom: -10px; }
        </style>
      </head>
      <body>
        <div class="certificate-border">
          <div class="header">
            ${schoolProfile.logo ? `<img src="${schoolProfile.logo.startsWith('http') ? schoolProfile.logo : 'file://' + schoolProfile.logo.replace(/\\/g, '/')}" class="school-logo" />` : ''}
            <div class="school-name">${schoolProfile.name}</div>
            <div class="school-info">${schoolProfile.address || ''} | ${schoolProfile.phone || ''}</div>
          </div>
          
          <div class="title-container">
            <div class="title">${title}</div>
          </div>
          
          <div class="meta">
            <div>Serial No: <span class="highlight">${issueNumber || 'N/A'}</span></div>
            <div>Date: <span class="highlight">${date || new Date().toLocaleDateString()}</span></div>
          </div>
          
          <div class="body">
            This is to certify that <span class="highlight">${student.fullName}</span>, 
            son/daughter of <span class="highlight">${student.parentName || '________________'}</span>, 
            was a bonafide student of this institution in <span class="highlight">${student.className}</span>. 
            His/Her Date of Birth according to the school records is <span class="highlight">${student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '________________'}</span>.
            
            ${type === 'CHARACTER_CERTIFICATE'
        ? `During his/her stay in the school, his/her conduct and character were found to be <span class="highlight">EXCELLENT</span>. I wish him/her every success in life.`
        : `He/She has left the school on <span class="highlight">${date || '________________'}</span> for further studies. All dues have been cleared.`}
          </div>
          
          <div class="signatures">
            <div class="sig-box">
              <div class="sig-line">Class Teacher</div>
            </div>
            <div class="sig-box">
              ${(schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.signature) ? `<img src="${schoolProfile.signature.startsWith('http') ? schoolProfile.signature : 'file://' + schoolProfile.signature.replace(/\\/g, '/')}" class="principal-sig" />` : ''}
              <div class="sig-line">Principal</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
exports.generateCertificateHtml = generateCertificateHtml;
