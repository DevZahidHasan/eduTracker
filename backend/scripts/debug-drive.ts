import prisma from '../src/prisma';

async function debug() {
  console.log('--- Google Drive Debugging ---');
  const settings = await prisma.systemSetting.findMany({
    where: { key: { in: ['googleDriveEnabled', 'googleDriveFolderId', 'googleDriveCredentials'] } }
  });

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  console.log('Enabled:', settingsMap['googleDriveEnabled']);
  console.log('Folder ID:', settingsMap['googleDriveFolderId']);
  
  if (settingsMap['googleDriveCredentials']) {
    try {
      const creds = JSON.parse(settingsMap['googleDriveCredentials']);
      console.log('Service Account Email in JSON:', creds.client_email);
    } catch (e) {
      console.log('Credentials JSON is INVALID (could not parse)');
    }
  } else {
    console.log('Credentials JSON is MISSING');
  }
}

debug().catch(console.error).finally(() => prisma.$disconnect());
