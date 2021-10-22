import React, { createContext, useContext, useEffect, useState } from "react";
// Correlativo ao LocalStorage (app WEB)
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSessions from "expo-auth-session";
import { api } from "../services/api";

const CLIENT_ID = 'b004df5b25e2fdd74207';
const SCOPE = 'read:user';
// chaves cadastradas no storage
const USER_STORAGE = '@nlwheat:user';
const TOKEN_STORAGE = '@nlwheat:token';


type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  // Se tem um req. de autenticação sendo feita & ativar o loading
  isSigningIn: boolean;
  // função de entrar na aplicação
  signIn: () => Promise<void>;
  // função de sair na aplicação
  signOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

type AuthResponse = {
  token: string;
  user: User
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const signIn = async () => {
    try {
      setIsSigningIn(true);

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&escope=${SCOPE}`;

      const authSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;

      // console.log(params);
      // Object {
      //   "code": "3ad93064f28f23cbd103",
      // }
      if (authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access denied') {
        const authResponse = await api.post('/authenticate', { code: authSessionResponse.params.code });
        const { user, token } = authResponse.data as AuthResponse;

        // insere o token no cabeçalho de todas as req. a partir do login
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // 'JSON.stringfy' transforma JSON em string
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_STORAGE, token);

        setUser(user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigningIn(false);
    }
  }

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);
  }

  // toda vez q o user recarregar a aplicação ou fechar e voltar não precisará logar novamente
  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (userStorage && tokenStorage) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
        // 'JSON.parse' transforma string em JSON
        setUser(JSON.parse(userStorage));
      }

      setIsSigningIn(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      user,
      isSigningIn,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }