import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.systemSetting.findMany();
  console.log('--- Database Settings ---');
  settings.forEach(s => {
    if (s.key.includes('googleDrive')) {
       if (s.key === 'googleDriveCredentials') {
         console.log(`${s.key}: [Length: ${s.value?.length}]`);
       } else {
         console.log(`${s.key}: ${s.value}`);
       }
    }
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
