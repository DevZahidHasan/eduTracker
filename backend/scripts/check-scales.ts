import prisma from '../src/prisma';

async function main() {
  const scales = await prisma.gradeScale.findMany({
    orderBy: { minScore: 'desc' }
  });
  console.log(JSON.stringify(scales, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
