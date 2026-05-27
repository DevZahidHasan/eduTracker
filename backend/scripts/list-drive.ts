import { google } from 'googleapis';
import prisma from '../src/prisma';

async function listVisibleFiles() {
  const settings = await prisma.systemSetting.findMany({
    where: { key: { in: ['googleDriveCredentials'] } }
  });

  const credentialsJson = settings.find(s => s.key === 'googleDriveCredentials')?.value;
  if (!credentialsJson) {
    console.log('No credentials found');
    return;
  }

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  console.log('Listing all folders/files shared with this Service Account...');
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'files(id, name, mimeType)',
    q: "mimeType = 'application/vnd.google-apps.folder'",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const files = res.data.files;
  if (files?.length) {
    console.log('Found Folders:');
    files.forEach((file: any) => {
      console.log(`${file.name} (ID: ${file.id})`);
    });
  } else {
    console.log('No folders shared with this Service Account found.');
  }
}

listVisibleFiles().catch(console.error).finally(() => prisma.$disconnect());
