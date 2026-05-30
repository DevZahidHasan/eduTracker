import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'parent@edutracker.com' } });
  console.log(user ? 'User exists: ' + JSON.stringify(user) : 'User missing');
  const role = await prisma.role.findUnique({ where: { name: 'PARENT' } });
  console.log(role ? 'Role exists' : 'Role missing');
}
main().finally(() => { prisma.$disconnect(); pool.end(); });