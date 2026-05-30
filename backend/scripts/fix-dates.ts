import prisma from '../src/prisma';

const getMidnightUTCDate = (d: Date) => {
  // Extract local date components from the date
  // Since it was created using setHours(0,0,0,0) in local time
  // the local time is exactly midnight of the intended date.
  // We format it manually to YYYY-MM-DD to avoid timezone shifting
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
};

async function main() {
  console.log('Fixing dates for Marks...');
  const marks = await prisma.mark.findMany();
  let marksFixed = 0;
  for (const m of marks) {
    const newDate = getMidnightUTCDate(m.date);
    if (m.date.getTime() !== newDate.getTime()) {
      await prisma.mark.update({
        where: { id: m.id },
        data: { date: newDate }
      });
      marksFixed++;
    }
  }
  console.log(`Fixed ${marksFixed} Marks.`);

  console.log('Fixing dates for MarkLocks...');
  const markLocks = await prisma.markLock.findMany();
  let markLocksFixed = 0;
  for (const m of markLocks) {
    const newDate = getMidnightUTCDate(m.date);
    if (m.date.getTime() !== newDate.getTime()) {
      await prisma.markLock.update({
        where: { id: m.id },
        data: { date: newDate }
      });
      markLocksFixed++;
    }
  }
  console.log(`Fixed ${markLocksFixed} MarkLocks.`);

  console.log('Fixing dates for Attendances...');
  const attendances = await prisma.attendance.findMany();
  let attendancesFixed = 0;
  for (const a of attendances) {
    const newDate = getMidnightUTCDate(a.date);
    if (a.date.getTime() !== newDate.getTime()) {
      await prisma.attendance.update({
        where: { id: a.id },
        data: { date: newDate }
      });
      attendancesFixed++;
    }
  }
  console.log(`Fixed ${attendancesFixed} Attendances.`);

  console.log('Fixing dates for AttendanceLocks...');
  const attendanceLocks = await prisma.attendanceLock.findMany();
  let attendanceLocksFixed = 0;
  for (const a of attendanceLocks) {
    const newDate = getMidnightUTCDate(a.date);
    if (a.date.getTime() !== newDate.getTime()) {
      await prisma.attendanceLock.update({
        where: { id: a.id },
        data: { date: newDate }
      });
      attendanceLocksFixed++;
    }
  }
  console.log(`Fixed ${attendanceLocksFixed} AttendanceLocks.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
