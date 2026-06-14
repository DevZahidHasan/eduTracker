import { execSync } from 'child_process';
import assert from 'assert';
import app from '../src/app';
import prisma from '../src/prisma';
import http from 'http';
import jwt from 'jsonwebtoken';

const LICENSE_SECRET = process.env.LICENSE_SECRET || 'edu-tracker-master-license-secret-key-2026';

async function verify() {
  console.log('Starting server for license testing...');
  const server = http.createServer(app);
  
  await new Promise<void>((resolve) => {
    server.listen(5002, () => {
      console.log('Server listening on port 5002');
      resolve();
    });
  });

  const baseUrl = 'http://localhost:5002';
  
  // Login to get a token (Login is public, so it should work without license)
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@edutracker.com', password: '123456' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token || loginData.data?.accessToken || loginData.token || loginData.accessToken;

  // 1. Backup current license
  const originalLicense = await prisma.systemSetting.findUnique({ where: { key: 'LICENSE_KEY' } });

  try {
    console.log('Test 1: Missing license lockout');
    await prisma.systemSetting.deleteMany({ where: { key: 'LICENSE_KEY' } });
    
    const protectedRes = await fetch(`${baseUrl}/api/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(protectedRes.status, 402, 'Should be locked out (402) when license is missing');
    console.log('✅ Missing license lockout confirmed');

    console.log('Test 2: Invalid license lockout');
    await prisma.systemSetting.upsert({
      where: { key: 'LICENSE_KEY' },
      update: { value: 'invalid-token-string' },
      create: { key: 'LICENSE_KEY', value: 'invalid-token-string' }
    });

    const invalidRes = await fetch(`${baseUrl}/api/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(invalidRes.status, 402, 'Should be locked out (402) when license is invalid');
    console.log('✅ Invalid license lockout confirmed');

    console.log('Test 3: Expired license lockout');
    const expiredToken = jwt.sign(
      { clientName: 'Expired School', type: 'trial' },
      LICENSE_SECRET,
      { expiresIn: -3600 } // expired 1 hour ago
    );
    await prisma.systemSetting.update({
      where: { key: 'LICENSE_KEY' },
      data: { value: expiredToken }
    });

    const expiredRes = await fetch(`${baseUrl}/api/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(expiredRes.status, 402, 'Should be locked out (402) when license is expired');
    console.log('✅ Expired license lockout confirmed');

    console.log('Test 4: Activate with valid license');
    const validToken = jwt.sign(
      { clientName: 'Verified School', type: 'annual' },
      LICENSE_SECRET,
      { expiresIn: '365d' }
    );
    
    // Test activation endpoint
    const activateRes = await fetch(`${baseUrl}/api/license/update`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ licenseKey: validToken })
    });
    assert.strictEqual(activateRes.status, 200, 'Activation should succeed with valid license');
    
    const validRes = await fetch(`${baseUrl}/api/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(validRes.status, 200, 'Should have access with valid license');
    console.log('✅ Valid license activation confirmed');

  } catch (err: any) {
    console.error('\n❌ LICENSE TEST FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    console.log('Restoring original license...');
    if (originalLicense) {
      await prisma.systemSetting.upsert({
        where: { key: 'LICENSE_KEY' },
        update: { value: originalLicense.value },
        create: { key: 'LICENSE_KEY', value: originalLicense.value }
      });
    }
    server.close();
    await prisma.$disconnect();
  }
}

verify();
