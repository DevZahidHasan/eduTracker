import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { DayOfWeek } from '@prisma/client';

export const getClassesOverview = asyncHandler(async (req: Request, res: Response) => {
  const classes = await prisma.schoolClass.findMany({
    include: {
      sections: {
        include: {
          teacher: {
            select: { name: true, email: true }
          },
          _count: {
            select: { students: true }
          }
        }
      }
    }
  });

  const overview = await Promise.all(classes.map(async (c) => {
    const totalStudents = c.sections.reduce((acc, s) => acc + s._count.students, 0);
    
    // Average marks
    const marks = await prisma.mark.aggregate({
      where: {
        student: { className: c.name }
      },
      _avg: { score: true }
    });

    // Attendance percentage
    const attendance = await prisma.attendance.findMany({
      where: {
        student: { className: c.name }
      }
    });
    const totalAttendance = attendance.length;
    const presentAttendance = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendancePercentage = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    return {
      className: c.name,
      totalStudents,
      attendancePercentage: Math.round(attendancePercentage),
      averageMarks: marks._avg.score ? Math.round(marks._avg.score * 10) / 10 : 0,
      sections: c.sections.map(s => ({
        section: s.section,
        teacher: s.teacher?.name || 'Unassigned',
        studentCount: s._count.students
      }))
    };
  }));

  // Sort by class name (simple alphanumeric sort)
  overview.sort((a, b) => a.className.localeCompare(b.className, undefined, { numeric: true }));

  return res.status(200).json(new ApiResponse(200, overview, 'Classes overview fetched successfully'));
});

export const getSectionDetail = asyncHandler(async (req: Request, res: Response) => {
  const { className, section } = req.params;

  const classSection = await prisma.classSection.findUnique({
    where: { className_section: { className, section } },
    include: {
      teacher: { select: { id: true, name: true, email: true } },
      students: {
        orderBy: { rollNumber: 'asc' }
      },
      routines: {
        include: {
          periods: {
            include: {
              subject: true,
              teacher: { select: { id: true, name: true } }
            },
            orderBy: { startTime: 'asc' }
          }
        }
      }
    }
  });

  if (!classSection) {
    throw new ApiError(404, 'Section not found');
  }

  return res.status(200).json(new ApiResponse(200, classSection, 'Section details fetched successfully'));
});

interface RoutineInput {
  dayOfWeek: string;
  periods: {
    subjectId: string;
    teacherId: string | number;
    startTime: string;
    endTime: string;
    periodNumber?: number;
  }[];
}

export const updateRoutine = asyncHandler(async (req: Request, res: Response) => {
  const { className, section } = req.params;
  const { routines } = req.body as { routines: RoutineInput[] };

  if (!routines || !Array.isArray(routines)) {
    throw new ApiError(400, 'Routines must be an array');
  }

  const classSection = await prisma.classSection.findUnique({
    where: { className_section: { className, section } }
  });

  if (!classSection) {
    throw new ApiError(404, 'Section not found');
  }

  for (const r of routines) {
    const routine = await prisma.routine.upsert({
      where: {
        classSectionId_dayOfWeek: {
          classSectionId: classSection.id,
          dayOfWeek: r.dayOfWeek as DayOfWeek
        }
      },
      update: {},
      create: {
        classSectionId: classSection.id,
        dayOfWeek: r.dayOfWeek as DayOfWeek
      }
    });

    // Clear existing periods for this routine and recreate
    await prisma.period.deleteMany({ where: { routineId: routine.id } });

    if (r.periods && r.periods.length > 0) {
      await prisma.period.createMany({
        data: r.periods.map((p) => ({
          routineId: routine.id,
          subjectId: p.subjectId,
          teacherId: Number(p.teacherId),
          startTime: p.startTime,
          endTime: p.endTime,
          periodNumber: p.periodNumber ? Number(p.periodNumber) : null
        }))
      });
    }
  }

  return res.status(200).json(new ApiResponse(200, null, 'Routine updated successfully'));
});
export const updateSection = asyncHandler(async (req: Request, res: Response) => {
  const { className, section } = req.params;
  const { teacherId } = req.body;

  const updatedSection = await prisma.classSection.update({
    where: { className_section: { className, section } },
    data: { teacherId: teacherId ? Number(teacherId) : null },
    include: {
      teacher: { select: { id: true, name: true, email: true } }
    }
  });

  return res.status(200).json(new ApiResponse(200, updatedSection, 'Section updated successfully'));
});

export const getClassAnalytics = asyncHandler(async (req: Request, res: Response) => {
  // Aggregate data for class-wise analytics
  const classes = await prisma.schoolClass.findMany({
    include: {
      students: {
        include: {
          marks: true,
          attendances: true
        }
      }
    }
  });

  const analytics = classes.map(c => {
    let totalScore = 0;
    let totalMarksCount = 0;
    let totalAttendance = 0;
    let presentAttendance = 0;

    c.students.forEach(s => {
      s.marks.forEach(m => {
        totalScore += m.score;
        totalMarksCount++;
      });
      s.attendances.forEach(a => {
        totalAttendance++;
        if (a.status === 'PRESENT' || a.status === 'LATE') {
          presentAttendance++;
        }
      });
    });

    return {
      className: c.name,
      avgScore: totalMarksCount > 0 ? totalScore / totalMarksCount : 0,
      attendanceRate: totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0,
      studentCount: c.students.length
    };
  });

  // Calculate top performing and weakest class
  const sortedByScore = [...analytics].sort((a, b) => b.avgScore - a.avgScore);
  
  return res.status(200).json(new ApiResponse(200, {
    trends: analytics,
    topClass: sortedByScore[0]?.className || 'N/A',
    weakestClass: sortedByScore[sortedByScore.length - 1]?.className || 'N/A'
  }, 'Class analytics fetched successfully'));
});
