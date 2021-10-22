import React, { useState } from 'react';
import { Alert, Keyboard, TextInput, View } from 'react-native';
import { api } from '../../services/api';

import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm(){
  const [message, setMessage] = useState(''); // conteúdo da msg
  const [sendingMessage, setSendingMessage] = useState(false); // se a msg está sendo enviada

  const handleMessageSubmit = async () => {
    const messageFormatted = message.trim();

    if (messageFormatted.length > 0) {
      setSendingMessage(true);

      // faz o envio da mensagem
      await api.post('/messages', { message: messageFormatted });

      setMessage(''); // limpa o input do textarea
      Keyboard.dismiss(); // fecha oo teclado
      setSendingMessage(false);
      Alert.alert('Mensagem enviada com sucesso!');
    }

    Alert.alert('Escreva a mensagem para enviar.');
  }

  return (
    <View style={styles.container}>

      <TextInput
        // propriedade do iOS que deixa o teclado escuro
        keyboardAppearance="dark"
        placeholder="Qual sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline // permite msg de multiplas linhas
        max-length={140} // limite de caracteres
        onChangeText={setMessage}
        value={message}
        style={styles.input}
        editable={!sendingMessage} // permite editar qnd o envio da msg for concluído
      />

      <Button
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />

    </View>
  );
}