import React from 'react';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';
// componente responsável por "segurar" a aplicação na tela de splash(espera)
import AppLoading from 'expo-app-loading';
// componente responsável por lidar com a barra de 'status' do dispositivo
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/hooks/auth';
import { Home } from './src/screen/Home';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  }); // o carregamento das fontes é async

  // até que as fontes sejam carregadas
  if (!fontsLoaded) return <AppLoading />

  return (
    <AuthProvider>
      <StatusBar
        // estiliza a cor dos ícones
        style="light"
        // enxergar o fundo da aplicação
        translucent
        // qnd tiver rolagem o conteúdo passa por trás da barra de 'status'
        backgroundColor="transparent"
      />
      <Home />
    </AuthProvider>
  );
}
