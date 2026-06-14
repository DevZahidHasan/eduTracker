import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { verifyLicenseToken } from '../utils/license.util';
import { logger } from '../utils/logger';

export const licenseCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const licenseRecord = await prisma.systemSetting.findUnique({
      where: { key: 'LICENSE_KEY' }
    });

    if (!licenseRecord || !licenseRecord.value) {
      return res.status(402).json({ error: 'LICENSE_MISSING', message: 'System not activated. Please provide a valid license key.' });
    }

    const decoded = verifyLicenseToken(licenseRecord.value);

    if (!decoded) {
      return res.status(402).json({ error: 'LICENSE_EXPIRED', message: 'License key is invalid or has expired.' });
    }

    // Pass the license info along in case a route needs it
    (req as any).licenseInfo = decoded;
    next();
  } catch (error: any) {
    logger.error('License verification error: ' + error.message);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to verify license status' });
  }
};
