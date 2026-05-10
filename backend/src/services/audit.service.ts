import prisma from '../prisma';

export class AuditService {
  /**
   * Logs a generic action to the audit log
   */
  static async log(params: {
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT';
    entityType: string;
    entityId: string;
    performedBy: number;
    oldValue?: any;
    newValue?: any;
    metadata?: any;
  }) {
    try {
      const { action, entityType, entityId, performedBy, oldValue, newValue, metadata } = params;
      
      await prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          performedBy,
          oldValue: oldValue || undefined,
          newValue: newValue || undefined,
          // We can add metadata if we want to store extra context like IP, browser, etc.
          // For now, it's just stored in the JSON fields if needed.
        },
      });
    } catch (error) {
      console.error('AuditService.log failed:', error);
    }
  }

  /**
   * Specifically logs a CRUD operation with before/after state
   */
  static async logChange(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityType: string,
    entityId: string | number,
    userId: number,
    oldData?: any,
    newData?: any
  ) {
    return this.log({
      action,
      entityType,
      entityId: String(entityId),
      performedBy: userId,
      oldValue: oldData,
      newValue: newData
    });
  }

  /**
   * Helper to log attendance changes
   */
  static async logAttendance(userId: number, studentId: number, status: string, date: Date, oldStatus?: string) {
    return this.logChange(
      oldStatus ? 'UPDATE' : 'CREATE',
      'Attendance',
      `${studentId}-${date.toISOString().split('T')[0]}`,
      userId,
      oldStatus ? { status: oldStatus } : null,
      { status, date }
    );
  }

  /**
   * Helper to log mark changes
   */
  static async logMark(userId: number, markId: number, oldValue: any, newValue: any) {
    return this.logChange('UPDATE', 'Mark', markId, userId, oldValue, newValue);
  }
}
