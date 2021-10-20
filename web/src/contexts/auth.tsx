import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  // o usuário será do tipo User ou null, pq se o user ñ estiver autenticado ñ vai ter nada dentro de 'user'
  user: User | null;
  signInUrl: string;
  // tipo função, sem parâmetro, de retorno 'void', ou seja, sem retorno
  signOut: () => void;
}

// forma de tipificar o parâmetro do context
export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

// o props faz referência a propriedades dos components (href, className etc)
export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=cacd4aea5a586efe986f`;

  const signIn = async (githubCode: string) => {
    const response = await api.post<AuthResponse>('authenticate', {
      // inclui no corpo da rota HTTP
      code: githubCode,
    })

    const { token, user } = response.data;
    // guarda o token (JWT) no localStorage, permitindo o usuário ficar logado msm se fechar a página
    localStorage.setItem('@dowhile:token', token);

    // msm que o user ñ dê refresh na página, todas as req. feitas dps do login serão acompanhados do token de autenticação
    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  };

  // garantir a autenticidade do usuário durante a navegação
  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');
    
    if (token) {
      // o token precisa ir no body da requisição, pelo cabeçalho
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      // toda requisição daqui pra frente vai com o token de autenticação

      api.get<User>('profile').then(res => setUser(res.data));
    }
  }, [])

  // fazer login com o GitHub
  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      // 1ª param - toda a string antes do '?code='
      // 2ª param - toda a string depois do '?code='
      const [urlWithoutCode, githubCode] = url.split('?code=')

      // limpar a url de callback
      window.history.pushState({}, '', urlWithoutCode)

      // enviar o code p/ o back e fazer o login
      signIn(githubCode);
    }
  }, [])

  // retorna o componente AuthContext.Provide que vem de dentro do context
  return (
    // todos os componentes dentro dele tem acesso aos dados do context
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}