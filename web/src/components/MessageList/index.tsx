import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../../services/api';

import styles from './styles.module.scss';

import logo from '../../assets/logo.svg';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

// fila de mensagens
const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
})

export function MessageList() {
  // A tipagem do estado é um [] de Message(s)
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const THREE_SECONDS = 3000;
    setInterval(() => {
      if (messagesQueue.length > 0) {
        // sobrepor o estado messages com um novo array
        setMessages(prevState => [
          messagesQueue[0], // mensagem da fila na posição mais antiga
          prevState[0], // mensagem que já estava no estado na posição mais antiga
          prevState[1], // mas se o estado messages tiver menos que 3
        ].filter(Boolean)) // o filter remove valores que são "falsos" (null, undefined)

        // retira o primeiro (+ antigo) item da fila de mensagens
        messagesQueue.shift();
      }
    }, THREE_SECONDS)
  }, []);

  useEffect(() => {
    // A tipagem do retorno é um [] de Message(s)
    api.get<Message[]>('messages/last3').then(response => setMessages(response.data));
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logo} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {
          messages.map(message => {
            return (
              <li key={message.id} className={styles.message}>
                <p className={styles.messageContent}>{message.text}</p>
                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img src={message.user.avatar_url} alt={message.user.name} />
                  </div>
                  <span>{message.user.name}</span>
                </div>
              </li>
            );
          })
        }
      </ul>
    </div>
  )
}