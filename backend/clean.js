const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.attendance.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.student.deleteMany();
  console.log('Deleted all students');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });