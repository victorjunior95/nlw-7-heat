import React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ColorValue,
  ActivityIndicator // animação de carregamento
} from 'react-native';
// Lib de ícones
import { AntDesign } from '@expo/vector-icons';

import { styles } from './styles';

// estendendo a tipagem p/ tornar o componente dinâmico
type Props = TouchableOpacityProps & {
  title: string;
  color: ColorValue; // tipagem p/ color
  backgroundColor: ColorValue;
  // tornar a tipagem do componente dinâmico, ou seja, de acordo com name
  icon?: React.ComponentProps<typeof AntDesign>['name'];
  isLoading?: boolean;
}

export function Button({
  title,
  color,
  backgroundColor,
  icon,
  isLoading = false,
  ...rest
}: Props){
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      activeOpacity={0.7} // reduz o efeito do opacity
      // controla o uso do botão enquanto uma requisição estiver em andamento 
      disabled={isLoading}
      // no lugar do texto vai aparecer um "carregando"
      // recebe qualquer outra propriedade/atributo de botão
      {...rest}
    >

      {
        isLoading ? <ActivityIndicator color={color} /> :
          <>
            <AntDesign name={icon} size={24} style={styles.icon} />
            <Text style={[styles.title, { color }]}>
              {title}
            </Text>
          </>
      }

    </TouchableOpacity>
  );
}