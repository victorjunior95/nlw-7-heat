import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { UserPhoto } from '../UserPhoto';
import { styles } from './styles';

// Como será usado como um componente, começa com maiúscula
import LogoSvg from '../../assets/logo.svg';

export function Header(){
  return (
    <View style={styles.container}>
      <LogoSvg />

      <View style={styles.logoutButtom}>
        <TouchableOpacity>
          <Text style={styles.logoutText}>
            Sair
          </Text>
        </TouchableOpacity>

        <UserPhoto imageUri="https://github.com/victorjunior95.png" />
      </View>
    </View>
  );
}