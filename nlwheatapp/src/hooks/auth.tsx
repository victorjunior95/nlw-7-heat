import React, { createContext, useContext, useState } from "react";
import * as AuthSessions from "expo-auth-session";
import { api } from "../services/api";

const CLIENT_ID = 'b004df5b25e2fdd74207';
const SCOPE = 'read:user';

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
  }
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const signIn = async () => {
    setIsSigningIn(true);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&escope=${SCOPE}`;

    const { params } = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;

    // console.log(params);
    // Object {
    //   "code": "3ad93064f28f23cbd103",
    // }
    if (params && params.code) {
      try {
        const authResponse = await api.post('/authenticate', { code: params.code });
        const { user, token } = authResponse.data as AuthResponse;

        console.log(authResponse.data);
      } catch (error) {
        console.log(error)
      }
    }

    setIsSigningIn(false);

  }

  const signOut = async () => {

  }

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