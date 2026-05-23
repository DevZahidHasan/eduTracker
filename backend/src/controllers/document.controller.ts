import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { generatePdfFromHtml } from '../utils/pdfGenerator';
import { generateIDCardHtml, generateCertificateHtml } from '../utils/documentHtmlGenerator';

// --- Template Management ---

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const templates = await prisma.documentTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json(new ApiResponse(200, templates, 'Templates fetched successfully'));
});

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { name, type, config, isDefault } = req.body;

  if (isDefault) {
    // Unset other defaults of the same type
    await prisma.documentTemplate.updateMany({
      where: { type, isDefault: true },
      data: { isDefault: false }
    });
  }

  const template = await prisma.documentTemplate.create({
    data: { name, type, config, isDefault: !!isDefault }
  });
  res.status(201).json(new ApiResponse(201, template, 'Template created successfully'));
});

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, config, isDefault, type } = req.body;

  if (isDefault) {
    const currentTemplate = await prisma.documentTemplate.findUnique({ where: { id: parseInt(id) } });
    const targetType = type || currentTemplate?.type;
    await prisma.documentTemplate.updateMany({
      where: { type: targetType, isDefault: true },
      data: { isDefault: false }
    });
  }

  const template = await prisma.documentTemplate.update({
    where: { id: parseInt(id) },
    data: { name, config, isDefault, type }
  });
  res.status(200).json(new ApiResponse(200, template, 'Template updated successfully'));
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.documentTemplate.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Template deleted successfully'));
});

// --- Document Generation ---

export const generateIDCards = asyncHandler(async (req: Request, res: Response) => {
  const { studentIds, templateId } = req.body;

  if (!studentIds || !Array.isArray(studentIds)) {
    throw new ApiError(400, 'studentIds array is required');
  }

  const students = await prisma.student.findMany({
    where: { id: { in: studentIds.map(id => parseInt(id)) } },
    include: { class: true }
  });

  let template;
  if (templateId) {
    template = await prisma.documentTemplate.findUnique({ where: { id: parseInt(templateId) } });
  } else {
    template = await prisma.documentTemplate.findFirst({ where: { type: 'ID_CARD', isDefault: true } });
  }

  if (!template) {
    // If no template in DB, use a default fallback to avoid 404
    template = {
        config: {
            primaryColor: '#1e40af',
            secondaryColor: '#ffffff',
            textColor: '#1e293b',
            layout: 'portrait',
            showSchoolAddress: true,
            showSchoolPhone: true
        }
    };
  }

  const schoolProfile = await prisma.schoolProfile.findFirst();
  const html = generateIDCardHtml(students, schoolProfile, template.config);
  const pdfBuffer = await generatePdfFromHtml(html);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=id_cards.pdf');
  res.send(pdfBuffer);
});

export const generateCertificate = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, templateId, type, date, issueNumber } = req.body;

  const student = await prisma.student.findUnique({
    where: { id: parseInt(studentId) },
    include: { class: true }
  });

  if (!student) throw new ApiError(404, 'Student not found');

  let template;
  if (templateId) {
    template = await prisma.documentTemplate.findUnique({ where: { id: parseInt(templateId) } });
  } else {
    template = await prisma.documentTemplate.findFirst({ where: { type, isDefault: true } });
  }

  if (!template) {
     template = {
         config: {
            primaryColor: '#1e40af',
            borderStyle: 'double',
            titleFont: 'Georgia'
         }
     };
  }

  const schoolProfile = await prisma.schoolProfile.findFirst();
  const html = generateCertificateHtml(student, schoolProfile, template.config, { date, issueNumber, type });
  const pdfBuffer = await generatePdfFromHtml(html);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${type.toLowerCase()}.pdf`);
  res.send(pdfBuffer);
});
