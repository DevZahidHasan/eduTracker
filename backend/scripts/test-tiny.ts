import { google } from 'googleapis';
import prisma from '../src/prisma';
import stream from 'stream';

async function testTinyUpload() {
  const settings = await prisma.systemSetting.findMany({
    where: { key: { in: ['googleDriveCredentials', 'googleDriveFolderId'] } }
  });

  const credentialsJson = settings.find(s => s.key === 'googleDriveCredentials')?.value;
  const folderId = settings.find(s => s.key === 'googleDriveFolderId')?.value;

  if (!credentialsJson || !folderId) return;

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const s = new stream.PassThrough();
  s.end('Hello World');

  console.log('Testing tiny upload...');
  try {
    const res = await drive.files.create({
      requestBody: {
        name: 'test.txt',
        parents: [folderId]
      },
      media: {
        mimeType: 'text/plain',
        body: s
      },
      supportsAllDrives: true
    } as any);
    console.log('Tiny Upload Success! ID:', res.data.id);
  } catch (err: any) {
    console.error('Tiny Upload Failed:', err.message);
  }
}

testTinyUpload().catch(console.error).finally(() => prisma.$disconnect());
