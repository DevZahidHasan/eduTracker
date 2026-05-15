import prisma from '../prisma';

export const questionPaperService = {
  async getAllQuestionPapers(filters: { isTemplate?: boolean; className?: string; subject?: string } = {}) {
    const where: any = {};
    if (filters.isTemplate !== undefined) {
      where.isTemplate = filters.isTemplate;
    }
    if (filters.className) {
      where.className = filters.className;
    }
    if (filters.subject) {
      where.subject = filters.subject;
    }

    return prisma.questionPaper.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true },
        },
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getQuestionPaperById(id: string) {
    return prisma.questionPaper.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });
  },

  async createQuestionPaper(data: any, userId: number) {
    const { questions, ...paperData } = data;
    
    return prisma.questionPaper.create({
      data: {
        ...paperData,
        createdBy: userId,
        questions: {
          create: questions || [],
        },
      },
      include: {
        questions: true,
      },
    });
  },

  async duplicateQuestionPaper(id: string, userId: number, options: { isTemplate?: boolean; title?: string } = {}) {
    const originalPaper = await this.getQuestionPaperById(id);
    if (!originalPaper) throw new Error('Original paper not found');

    const { id: _, questions, user: __, createdAt: ___, updatedAt: ____, _count: _____, ...paperData } = originalPaper as any;

    return prisma.questionPaper.create({
      data: {
        ...paperData,
        title: options.title || `Copy of ${paperData.title}`,
        isTemplate: options.isTemplate ?? false,
        templateId: originalPaper.isTemplate ? originalPaper.id : originalPaper.templateId,
        createdBy: userId,
        status: 'DRAFT',
        questions: {
          create: questions.map((q: any) => {
            const { id: ___, questionPaperId: ____, ...questionData } = q;
            return questionData;
          }),
        },
      },
      include: {
        questions: true,
      },
    });
  },

  async updateQuestionPaper(id: string, data: any) {
    const { questions, ...paperData } = data;
    
    // We update paper data and if questions are provided, we recreate them (simple approach)
    // A more complex approach would involve syncing questions individually
    return prisma.$transaction(async (tx) => {
      const updatedPaper = await tx.questionPaper.update({
        where: { id },
        data: paperData,
      });

      if (questions && Array.isArray(questions)) {
        await tx.question.deleteMany({
          where: { questionPaperId: id },
        });

        if (questions.length > 0) {
          await tx.question.createMany({
            data: questions.map((q: any) => {
              const { id: _, questionPaperId: __, ...questionData } = q;
              return {
                ...questionData,
                questionPaperId: id,
              };
            }),
          });
        }
      }

      return tx.questionPaper.findUnique({
        where: { id },
        include: { questions: { orderBy: { order: 'asc' } } },
      });
    });
  },

  async deleteQuestionPaper(id: string) {
    return prisma.questionPaper.delete({
      where: { id },
    });
  },
};
