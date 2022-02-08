import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies, setCookie } from 'nookies';
import Router from "next/router";
import { api } from "../services/api";

interface User {
  name?: string;
  email: string;
  iconImageUrl?: string | null
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  login(credentials: LoginCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'next-simple-sns': token } = parseCookies();

    if(token) {
      api.get('/account').then(response => {
        const { name, email, iconImageUrl } = response.data.user;

        setUser({ name, email, iconImageUrl })
      })
    }
  }, [])

  async function login({ email, password }: LoginCredentials) {
    try {
      const response = await api.post('auth', {
        email,
        password
      });

      console.log("login", response);

      const { token } = response.data;
      const { name, iconImageUrl } = response.data.user;

      setCookie(undefined, 'next-simple-sns', token, {
        maxAge: 60 * 60 * 24, //24 hours;
        path: '/' //どのパスがこのクッキーをアクセスできるか。
      });

      setUser({
        name, email, iconImageUrl
      });

      // Headerにあるtokenの更新
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ login, isAuthenticated, user }}>
      { children }
    </AuthContext.Provider>
  )
}
