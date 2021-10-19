import prismaClient from '../prisma';

import { io } from '../app';

class CreateMessageService {
  async execute(text: string, user_id: string) {
    const message = await prismaClient.message.create({
      data: {
        text,
        user_id
      },
      // ao retornar, traga junto as infos do user que cadastrou a msg
      include: {
        user: true
      }
    });

    const infoWS = {
      text: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url
      }
    }
    // evento de emissão (new_message) p/ public/index.html
    io.emit("new_message", infoWS)

    return message;
  }
}

export { CreateMessageService }