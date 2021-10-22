import React from 'react';
import { Text, View } from 'react-native';
import { MotiView } from 'moti'; // Lib de animações

import { UserPhoto } from '../UserPhoto';

import { styles } from './styles';

export type MessageProps = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

type Props = {
  data: MessageProps;
}

export function Message({ data }: Props){
  return (
    <MotiView
      // na vertical
      from={{ opacity: 0, translateY: -50 }}
      // animação em si (como de estivesse caindo)
      animate={{ opacity: 1, translateY: 0 }}
      // tempo de "queda"
      transition={{ type: 'timing', duration: 700 }}
      style={styles.container}
    >
      <Text style={styles.message}>
        {data.text}
      </Text>

      <View style={styles.footer}>
        <UserPhoto
          sizes="SMALL"
          imageUri={data.user.avatar_url}
        />

        <Text style={styles.userName}>
          {data.user.name}
        </Text>
      </View>
    </MotiView>
  );
}