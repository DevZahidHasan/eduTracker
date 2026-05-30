import prisma from '../src/prisma'; 
prisma.examType.findMany().then(console.log).finally(() => prisma.$disconnect());