import { PrismaClient } from '@prisma/client';

async function checkQuizzes() {
  const prisma = new PrismaClient();
  
  try {
    // Obtener todos los quizzes
    const allQuizzes = await prisma.quiz.findMany({
      where: { deletedAt: null }
    });
    
    console.log('Todos los quizzes:', allQuizzes);
    
    // Obtener quizzes por el topicId específico
    const topicId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const quizzesByTopic = await prisma.quiz.findMany({
      where: { 
        topicId,
        deletedAt: null
      }
    });
    
    console.log(`Quizzes con topicId ${topicId}:`, quizzesByTopic);
    
    // Obtener quizzes publicados por el topicId específico
    const publishedQuizzesByTopic = await prisma.quiz.findMany({
      where: { 
        topicId,
        deletedAt: null,
        isPublished: true
      }
    });
    
    console.log(`Quizzes publicados con topicId ${topicId}:`, publishedQuizzesByTopic);
  } catch (error) {
    console.error('Error al consultar quizzes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuizzes();