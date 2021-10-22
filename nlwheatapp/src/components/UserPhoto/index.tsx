import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import avatarImg from '../../assets/avatar.png';

import { styles } from './styles';
import { COLORS } from '../../theme';

const SIZES ={
  SMALL: {
    containerSize: 32,
    avatarSize: 28
  },
  NORMAL: {
    containerSize: 48,
    avatarSize: 42
  }
}

type Props = {
  // Caso não haja usuário logado
  imageUri: string | undefined;
  // '?' atributo opcional
  sizes?: 'SMALL' | 'NORMAL';
}

const AVATAR_DEFAULT = Image.resolveAssetSource(avatarImg).uri;

//    caso não haja uma definição, o default é NORMAL
export function UserPhoto({ imageUri, sizes = 'NORMAL' }: Props){
  // Pegando de SIZES[na posição vinda por param.] e desestruturando
  const { containerSize, avatarSize } = SIZES[sizes];

  return (
    <LinearGradient
      colors={[COLORS.PINK, COLORS.YELLOW]}
      // muda a direção do gradiente
      start={{ x: 0, y: 0.8 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2
        }
      ]}
    >
      <Image
        source={{ uri: imageUri || AVATAR_DEFAULT }}
        // ao usar o [] posso passar +1 styles
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2
          }
        ]}
      />
    </LinearGradient>
  );
} 