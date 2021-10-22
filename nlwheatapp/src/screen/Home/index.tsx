import React from 'react';
import { KeyboardAvoidingView, View, Platform } from 'react-native';

import { Header } from '../../components/Header';
import { MessageList } from '../../components/MessageList';
import { SendMessageForm } from '../../components/SendMessageForm';
import { SignInBox } from '../../components/SignInBox';

import { useAuth } from '../../hooks/auth';

import { styles } from './styles';

export function Home() {
  const { user } = useAuth();

  return (
    // permite que o teclado seja acionado ao toque do textarea no iOS
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Header />
        <MessageList />
        { user ? <SendMessageForm /> : <SignInBox /> }
      </View>
    </KeyboardAvoidingView>
  );
}