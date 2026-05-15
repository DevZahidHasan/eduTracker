import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const feeTypes = await prisma.feeType.findMany();
  console.log('Fee Types in DB:');
  console.table(feeTypes.map(f => ({ id: f.id, name: f.name, isMonthly: f.isMonthly })));
  
  const vouchers = await prisma.feeVoucher.findMany({
    include: { items: { include: { feeType: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log('\nLatest Vouchers Sample:');
  vouchers.forEach(v => {
    console.log(`Voucher ${v.id} - Total: ${v.totalAmount}`);
    v.items.forEach(item => {
      console.log(`  - ${item.feeType.name}: ${item.amount} (Monthly: ${item.feeType.isMonthly})`);
    });
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
