import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';

import { Server } from 'socket.io';

import { router } from './routes';

const app = express();
app.use(cors());


// Quando subir o server HTTP a app vai junto
const serverHttp = http.createServer(app);
// conexão ao 'io' do client
const  io = new Server(serverHttp, {
  cors: {
    origin: "*" //habilita qualquer origem/fonte (front ou mobile)
  }
});

// permite emitir e escutar um evento dentro do websocket
// nesse caso é o evento de conexão (connection) p/ identificar os user que se conectaram
io.on("connection", socket => {
  console.log(`Usuário conectado no socket ${socket.id}`)
});

app.use(express.json());

app.use(router);

// Rota de autenticação do usuário no GitHub
//    Vão vir do Front e Mobile
app.get('/github', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});
app.get('/signin/callback', (req, res) => {
  const { code } = req.query;

  return res.json(code);
});

export { serverHttp, io };
