import { execSync } from 'child_process';
import assert from 'assert';
import app from '../src/app';
import prisma from '../src/prisma';
import http from 'http';
import path from 'path';

async function verify() {
  const uniqueSuffix = Date.now().toString().slice(-6);
  const testStudentId = `STU-${uniqueSuffix}`;

  console.log('Starting server...');
  const server = http.createServer(app);
  
  await new Promise<void>((resolve) => {
    server.listen(5001, () => {
      console.log('Server listening on port 5001');
      resolve();
    });
  });

  const baseUrl = 'http://localhost:5001';
  let token = '';

  try {
    console.log('1. Login and role-based access');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@edutracker.com', password: '123456' })
    });
    const loginData = await loginRes.json();
    assert.strictEqual(loginRes.status, 200, `Login failed: ${JSON.stringify(loginData)}`);
    token = loginData.data?.token || loginData.data?.accessToken || loginData.token || loginData.accessToken;
    assert.ok(token, `Token not found in response: ${JSON.stringify(loginData)}`);

    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    assert.strictEqual(meData.data.user.role, 'ADMIN', 'Role is not ADMIN');

    console.log('2. Student admission and editing');
    await prisma.classSection.upsert({
      where: { className_section: { className: 'CLASS_10', section: 'Z' } },
      update: {},
      create: { className: 'CLASS_10', section: 'Z' }
    });

    const studentRes = await fetch(`${baseUrl}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        studentId: testStudentId,
        rollNumber: uniqueSuffix,
        fullName: 'Test Student',
        className: 'CLASS_10',
        section: 'Z',
        gender: 'MALE',
      })
    });
    const studentData = await studentRes.json();
    assert.strictEqual(studentRes.status, 201, `Admission failed: ${JSON.stringify(studentData)}`);
    const studentId = studentData.data.id;

    const editRes = await fetch(`${baseUrl}/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        studentId: testStudentId,
        rollNumber: uniqueSuffix,
        fullName: 'Test Student Updated',
        className: 'CLASS_10',
        section: 'Z',
        gender: 'MALE'
      })
    });
    const editData = await editRes.json();
    assert.strictEqual(editRes.status, 200, `Student editing failed: ${JSON.stringify(editData)}`);

    console.log('3. Attendance entry and save');
    const class10Students = await prisma.student.findMany({
      where: { className: 'CLASS_10', section: 'Z' }
    });
    const attendanceRecords = class10Students.map(stu => ({
      studentId: stu.id,
      status: 'PRESENT',
      remarks: 'Good',
      date: new Date().toISOString().split('T')[0]
    }));

    const attRes = await fetch(`${baseUrl}/api/attendance/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        className: 'CLASS_10',
        section: 'Z',
        records: attendanceRecords
      })
    });
    const attData = await attRes.json();
    assert.ok([200, 201].includes(attRes.status), `Attendance failed: ${JSON.stringify(attData)}`);

    console.log('4. Marks entry and lock flow');
    const marksRes = await fetch(`${baseUrl}/api/marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        studentId: studentId,
        subject: 'MATH',
        examType: 'Term 1',
        score: 85,
        maxScore: 100,
        year: 2020 + (Date.now() % 70)
      })
    });
    const marksData = await marksRes.json();
    assert.strictEqual(marksRes.status, 201, `Marks entry failed: ${JSON.stringify(marksData)}`);

    const lockRes = await fetch(`${baseUrl}/api/marks/finalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        examType: 'Term 1',
        subject: 'MATH',
        className: 'CLASS_10',
        year: 2020 + (Date.now() % 70)
      })
    });
    assert.ok([200, 201].includes(lockRes.status), `Marks lock failed: ${lockRes.status}`);

    console.log('5. Report card generation');
    const reportRes = await fetch(`${baseUrl}/api/reports/student?studentId=${studentId}&examType=Term 1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const reportData = await reportRes.json();
    assert.strictEqual(reportRes.status, 200, `Report card generation failed: ${JSON.stringify(reportData)}`);

    console.log('6. Fee entry and receipt generation');
    // Create Fee Type
    const feeTypeRes = await fetch(`${baseUrl}/api/finance/fee-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: `Monthly Fee ${uniqueSuffix}`, isMonthly: true })
    });
    const feeTypeData = await feeTypeRes.json();
    assert.strictEqual(feeTypeRes.status, 201, `Fee type creation failed: ${JSON.stringify(feeTypeData)}`);
    const feeTypeId = feeTypeData.data.id;

    // Create Fee Structure
    await fetch(`${baseUrl}/api/finance/fee-structures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ className: 'CLASS_10', feeTypeId, amount: 5000 })
    });

    // Generate Vouchers
    const genRes = await fetch(`${baseUrl}/api/finance/vouchers/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ className: 'CLASS_10', month: 6, year: 2026, dueDate: '2026-06-30' })
    });
    assert.ok([200, 201].includes(genRes.status), `Voucher generation failed: ${genRes.status}`);

    // Get Voucher
    const vouchersRes = await fetch(`${baseUrl}/api/finance/vouchers?studentId=${studentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const vouchersData = await vouchersRes.json();
    const voucher = vouchersData.data[0];
    assert.ok(voucher, 'Voucher not found for student');

    // Collect Payment
    const collectRes = await fetch(`${baseUrl}/api/finance/payments/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ voucherId: voucher.id, amount: 5000, paymentMethod: 'CASH' })
    });
    assert.ok([200, 201].includes(collectRes.status), `Payment collection failed: ${collectRes.status}`);

    // Export Receipt
    const receiptRes = await fetch(`${baseUrl}/api/finance/export-receipt/${voucher.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(receiptRes.status, 200, 'Receipt export failed');

    console.log('7. HR staff creation and payroll');
    const staffEmail = `teacher.${uniqueSuffix}@school.com`;
    const userRes = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: 'New Teacher',
        email: staffEmail,
        role: 'TEACHER',
        password: 'password123',
        canLogin: true
      })
    });
    const userData = await userRes.json();
    assert.strictEqual(userRes.status, 201, `User creation failed: ${JSON.stringify(userData)}`);
    const staffId = userData.data.id;

    // Update Salary
    const salaryRes = await fetch(`${baseUrl}/api/hr/staff/${staffId}/salary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        baseSalary: 30000,
        allowances: 5000,
        deductions: 1000
      })
    });
    assert.strictEqual(salaryRes.status, 200, 'Salary update failed');

    // Generate Payroll
    const payrollRes = await fetch(`${baseUrl}/api/hr/payroll/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ month: 6, year: 2026 })
    });
    const payrollData = await payrollRes.json();
    assert.ok([200, 201].includes(payrollRes.status), `Payroll generation failed: ${payrollRes.status}`);

    const payrollRecord = (payrollData.data as any[]).find((r: any) => r.userId === staffId);
    assert.ok(payrollRecord, 'Payroll record not found for created staff');

    // Pay Salary
    const payRes = await fetch(`${baseUrl}/api/hr/payroll/${payrollRecord.id}/pay`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ paymentMethod: 'CASH', transactionId: 'TXN-TEST' })
    });
    assert.strictEqual(payRes.status, 200, 'Salary payment failed');

    console.log('8. Library issue and return');
    const bookRes = await fetch(`${baseUrl}/api/library/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Test Book',
        author: 'Test Author',
        isbn: `ISBN-${uniqueSuffix}`,
        totalCopies: 5,
        category: 'General'
      })
    });
    const bookData = await bookRes.json();
    assert.strictEqual(bookRes.status, 201, `Book creation failed: ${JSON.stringify(bookData)}`);
    const bookId = bookData.data.id;

    // Create Library Member
    const memberRes = await fetch(`${baseUrl}/api/library/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ studentId: studentId })
    });
    const memberData = await memberRes.json();
    assert.strictEqual(memberRes.status, 201, `Library member creation failed: ${JSON.stringify(memberData)}`);
    const memberIdString = memberData.data.memberId;

    // Issue Book
    const issueRes = await fetch(`${baseUrl}/api/library/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        bookId: bookId,
        memberId: memberIdString,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
    });
    const issueData = await issueRes.json();
    assert.strictEqual(issueRes.status, 201, `Book issue failed: ${JSON.stringify(issueData)}`);
    const transactionId = issueData.data.id;

    const returnRes = await fetch(`${baseUrl}/api/library/issues/${transactionId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(returnRes.status, 200, 'Book return failed');

    console.log('9. Transport assignment and billing');
    const routeRes = await fetch(`${baseUrl}/api/transport/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: `Route ${uniqueSuffix}`,
        stops: [{ name: 'Stop A' }, { name: 'Stop B' }],
        fare: 1000
      })
    });
    const routeData = await routeRes.json();
    assert.strictEqual(routeRes.status, 201, `Route creation failed: ${JSON.stringify(routeData)}`);
    const routeId = routeData.data.id;
    const stopId = routeData.data.stops[0].id;

    const assignRes = await fetch(`${baseUrl}/api/transport/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        studentId: studentId,
        busRouteId: routeId,
        busStopId: stopId
      })
    });
    assert.strictEqual(assignRes.status, 200, `Transport assignment failed: ${assignRes.status}`);

    console.log('10. Question paper creation and PDF export');
    const qpRes = await fetch(`${baseUrl}/api/question-papers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Test Paper',
        subject: 'MATH',
        examType: 'Term 1',
        className: 'CLASS_5',
        totalMarks: 100,
        duration: 120,
        content: '[]'
      })
    });
    const qpData = await qpRes.json();
    assert.strictEqual(qpRes.status, 201, `Question paper creation failed: ${JSON.stringify(qpData)}`);
    const paperId = qpData.data.id;

    const exportRes = await fetch(`${baseUrl}/api/question-papers/${paperId}/export/pdf`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.ok([200, 201].includes(exportRes.status), 'Question paper PDF export failed');

    console.log('\n✅ ALL WORKFLOWS PASSED SUCCESSFULLY!');

  } catch (err: any) {
    console.error('\n❌ WORKFLOW FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    console.log('Shutting down server...');
    server.close();
    await prisma.$disconnect();
  }
}

verify();
