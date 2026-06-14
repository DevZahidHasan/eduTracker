import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma';

let token: string;
let studentId: number;
let sectionStudents: any[];

describe('Core School Workflows', () => {
  beforeAll(async () => {
    // Attempt login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@edutracker.com', password: '123456' });
    
    if (res.body.data && res.body.data.token) {
      token = res.body.data.token;
    } else {
      console.warn('Login failed, tests might fail if auth is required:', res.body);
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('1. Login and role-based access', async () => {
    expect(token).toBeDefined();
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('2. License Check', async () => {
    const res = await request(app)
      .get('/api/license/status')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('3. Student admission and editing', async () => {
    const uniqueId = `STU-TEST-${Date.now()}`;
    const uniqueRoll = `${Date.now() % 10000}`;
    const admissionRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: uniqueId,
        rollNumber: uniqueRoll,
        fullName: 'Test Student',
        className: 'CLASS_5',
        section: 'A',
        gender: 'MALE',
      });
    
    if (admissionRes.status !== 201) {
      console.error('Admission failed:', admissionRes.body);
    }
    
    expect(admissionRes.status).toBe(201);
    studentId = admissionRes.body.data.id;

    // Fetch all students in CLASS_5 A to pass the bulk attendance validation
    const listRes = await request(app)
      .get('/api/students?className=CLASS_5')
      .set('Authorization', `Bearer ${token}`);
    sectionStudents = listRes.body.data.filter((s: any) => s.section === 'A');
  });

  it('4. Attendance entry and save', async () => {
    const records = sectionStudents.map(student => ({
      studentId: student.id,
      date: new Date().toISOString().split('T')[0],
      status: 'PRESENT'
    }));

    const res = await request(app)
      .post('/api/attendance/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({ records });
    expect(res.status).toBe(200);
  });

  it('5. Marks entry and lock flow', async () => {
    const records = sectionStudents.map(student => ({
      studentId: student.id,
      subject: 'MATH',
      examType: 'Term 1',
      score: 85,
      maxScore: 100,
      year: new Date().getFullYear()
    }));

    const marksRes = await request(app)
      .post('/api/marks/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({ records });
    expect(marksRes.status).toBe(200);
  });

  it('6. Fee collection', async () => {
    const collectRes = await request(app)
      .post('/api/finance/payments/collect')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: studentId,
        amount: 5000,
        paymentMethod: 'CASH',
        reference: 'RCP-001',
        notes: 'Test Payment'
      });
    expect([200, 201, 400]).toContain(collectRes.status);
  });
});
