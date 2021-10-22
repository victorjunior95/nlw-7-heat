import React from 'react';
import { ScrollView } from 'react-native';
import { Message } from '../Message';

import { styles } from './styles';

export function MessageList(){
  const message = {
    id: "1",
    text: "mensagem de teste",
    user: {
      name: "Victor Junior",
      avatar_url: "https://github.com/victorjunior95.png"
    }
  }

  return (
    <ScrollView
      style={styles.container}
      // estilizar o conteúdo do elemento
      contentContainerStyle={styles.content}
      // toda vez que alguém tocar na lista o teclado fecha
      keyboardShouldPersistTaps="never"
    >
      <Message data={message} />
      <Message data={message} />
      <Message data={message} />
    </ScrollView>
  );
}