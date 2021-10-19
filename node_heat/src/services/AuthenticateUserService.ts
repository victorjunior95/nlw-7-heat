import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse{
  avatar_url: string,
  login: string,
  id: number,
  name: string
}

class AuthenticateUserService {
  // 1. Receber o code(string)
  async execute(code: string) {
    // 2. Recuperar o access_token no GitHub
    const url = 'https://github.com/login/oauth/access_token';

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        "Accept": "application/json"
      }
    });

    // 3. Recuperar infos do user no GitHub
    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    });

    // 4. Verificar se o usuário existe no DB
    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      //    Se sim, gera um token
      where: {
        github_id: id
      }
    })

    //    Se não, cria no DB e gera um token
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }

    // 5. Retornar o token com as infos do user
    //    1º param - payload(tudo q o usuário terá acesso)
    //    2º param - secret(criar e validar/autenticar o token)
    //    3º param - subject(ID do usuário e prazo p/ expirar o token)
    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    )

    return { token, user };
  }
}

export { AuthenticateUserService }