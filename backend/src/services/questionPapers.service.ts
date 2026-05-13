import prisma from '../prisma';

export const questionPaperService = {
  async getAllQuestionPapers() {
    return prisma.questionPaper.findMany({
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
            data: questions.map((q: any) => ({
              ...q,
              questionPaperId: id,
            })),
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
