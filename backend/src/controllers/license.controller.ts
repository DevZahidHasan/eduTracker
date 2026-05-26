import { Request, Response } from 'express';
import prisma from '../prisma';
import { verifyLicenseToken } from '../utils/license.util';

export const getLicenseStatus = async (req: Request, res: Response) => {
  try {
    const licenseRecord = await prisma.systemSetting.findUnique({
      where: { key: 'LICENSE_KEY' }
    });

    if (!licenseRecord || !licenseRecord.value) {
      return res.status(200).json({ status: 'MISSING', message: 'No license key configured.' });
    }

    const decoded = verifyLicenseToken(licenseRecord.value);

    if (!decoded) {
      return res.status(200).json({ status: 'EXPIRED', message: 'License has expired or is invalid.' });
    }

    // Convert exp to ISO string
    const expiryDate = new Date(decoded.exp * 1000).toISOString();

    return res.status(200).json({
      status: 'VALID',
      clientName: decoded.clientName,
      type: decoded.type,
      expiryDate,
    });
  } catch (error) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to check license status' });
  }
};

export const updateLicense = async (req: Request, res: Response) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'License key is required.' });
    }

    const decoded = verifyLicenseToken(licenseKey);

    if (!decoded) {
      return res.status(400).json({ error: 'INVALID_LICENSE', message: 'The provided license key is invalid or expired.' });
    }

    // Upsert the setting
    await prisma.systemSetting.upsert({
      where: { key: 'LICENSE_KEY' },
      update: { value: licenseKey },
      create: { key: 'LICENSE_KEY', value: licenseKey },
    });

    return res.status(200).json({ message: 'License key verified and saved successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update license key' });
  }
};
