import prisma from '../src/prisma';
async function main() {
  const s = await prisma.systemSetting.findUnique({ where: { key: 'LICENSE_KEY' } });
  console.log('LICENSE_KEY:', s);
}
main().catch(console.error).finally(() => prisma.$disconnect());
