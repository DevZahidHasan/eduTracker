require('dotenv').config();
const jwt = require('jsonwebtoken');

// Ensure this matches the secret used in utils/license.util.ts
const LICENSE_SECRET = process.env.LICENSE_SECRET || 'edu-tracker-master-license-secret-key-2026';

function generateLicense(clientName, type, expiresInDays) {
  const payload = {
    clientName,
    type,
  };

  const expiresInSeconds = expiresInDays * 24 * 60 * 60;
  
  const token = jwt.sign(payload, LICENSE_SECRET, { expiresIn: expiresInSeconds });
  
  console.log('==========================================');
  console.log('🎉 LICENSE GENERATED SUCCESSFULLY 🎉');
  console.log('==========================================');
  console.log(`Client Name  : ${clientName}`);
  console.log(`License Type : ${type}`);
  console.log(`Valid for    : ${expiresInDays} days`);
  console.log('------------------------------------------');
  console.log('LICENSE KEY (Copy below):');
  console.log(token);
  console.log('==========================================');
  return token;
}

// Read arguments from command line
const args = process.argv.slice(2);
const clientName = args[0] || 'Demo School';
const type = args[1] || 'annual'; // 'trial', 'annual', 'lifetime'
const expiresInDays = parseInt(args[2], 10) || 365;

generateLicense(clientName, type, expiresInDays);
