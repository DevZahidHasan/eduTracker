import jwt from 'jsonwebtoken';

const LICENSE_SECRET = process.env.LICENSE_SECRET || 'edu-tracker-master-license-secret-key-2026';

export interface LicensePayload {
  clientName: string;
  type: 'trial' | 'annual' | 'lifetime';
  exp: number; // Expiry timestamp
}

export const verifyLicenseToken = (token: string): LicensePayload | null => {
  try {
    const decoded = jwt.verify(token, LICENSE_SECRET) as LicensePayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const generateLicenseToken = (payload: Omit<LicensePayload, 'exp'> & { expiresInDays: number }): string => {
  const expiresInSeconds = payload.expiresInDays * 24 * 60 * 60;
  return jwt.sign(
    {
      clientName: payload.clientName,
      type: payload.type,
    },
    LICENSE_SECRET,
    { expiresIn: expiresInSeconds }
  );
};
