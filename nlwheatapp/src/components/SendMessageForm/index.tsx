import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm(){
  const [message, setMessage] = useState(''); // conteúdo da msg
  const [sendingMessage, setSendingMessage] = useState(false); // se a msg está sendo enviada

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
      />

    </View>
  );
}