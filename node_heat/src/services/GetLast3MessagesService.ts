import prismaClient from '../prisma';

class GetLast3MessagesService {
  async execute() {
    const messages = await prismaClient.message.findMany({
      take: 3, // as três últimas
      orderBy: { // ordenadas por
        created_at: "desc" // ordem de criação, da + recente p/ + antiga
      },
      include: {
        user: true
      }
    });

    // TRADUZIDO P/ SQL
    // SELECT * FROM MESSAGES LIMIT 3 ORDER BY created_at DESC

    return messages;
  }
}

export { GetLast3MessagesService }