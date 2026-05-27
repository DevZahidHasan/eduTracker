import prisma from '../src/prisma';

async function main() {
  const emptyEmailCount = await prisma.student.count({
    where: { email: '' }
  });
  console.log('Students with empty email string (""):', emptyEmailCount);

  const nullEmailCount = await prisma.student.count({
    where: { email: null }
  });
  console.log('Students with null email:', nullEmailCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
