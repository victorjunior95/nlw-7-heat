import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { api } from '../../services/api';
import { io } from 'socket.io-client';

import { MESSAGES_EXAMPLE } from '../../utils/messages';

import { Message, MessageProps } from '../Message';

import { styles } from './styles';

// fila de mensagens
// let messagesQueue: MessageProps[] = []; // tipagem para variáveis do tipo let
// Exemplo com MESSAGES_EXAMPLE como valor inicial da fila de mensagens
let messagesQueue: MessageProps[] = MESSAGES_EXAMPLE;

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', (newMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList(){
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);
  // const message = {
  //   id: "1",
  //   text: "mensagem de teste",
  //   user: {
  //     name: "Victor Junior",
  //     avatar_url: "https://github.com/victorjunior95.png"
  //   }
  // }

  // executado 1x trazendo as últimas três mensagens
  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('/messages/last3');
      setCurrentMessages(messagesResponse.data);
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    const THREE_SECONDS = 3000
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        // prevState é uma referência ao estado prévio/anterior
        setCurrentMessages(prevState => [messagesQueue[0], prevState[0], prevState[1]]);
        // remove o primeiro elemento dado que já foi exibido
        messagesQueue.shift();
      }
    }, THREE_SECONDS);

    // função de desmontagem do useEffect, limpando variáveis/dados da memória
    //    resetar o timer
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      // estilizar o conteúdo do elemento
      contentContainerStyle={styles.content}
      // toda vez que alguém tocar na lista o teclado fecha
      keyboardShouldPersistTaps="never"
    >
      {
        currentMessages.map(message => <Message key={message.id} data={message} />)
      }

      {/* <Message data={message} />
      <Message data={message} />
      <Message data={message} /> */}
    </ScrollView>
  );
}