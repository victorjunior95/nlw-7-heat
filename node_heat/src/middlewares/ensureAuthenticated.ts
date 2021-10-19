import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
}

export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if(!authToken) {
    return res.status(401).json({
      errorCode: "token.invalid"
    });
  }

  // desestruturar o token ("Bearer 12jnasdo32094nçlasndonçkl56")
  //    [0] = Bearer
  //    split = espaço
  //    [1] = 12jnasdo32094nçlasndonçkl56
  const [, token] = authToken.split(" ");

  // verifica se o token é válido
  try {
    // no 'sub' vem o id do user
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;

    req.user_id = sub

    return next();
  } catch (error) {
    res.status(401).json({
      errorCode: "token.expired"
    });
  }
}