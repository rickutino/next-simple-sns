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

interface SingUpCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextData {
  login(credentials: LoginCredentials): Promise<void>;
  singUp(credentials: SingUpCredentials): Promise<void>;
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
  
  async function singUp({ name, email, password }: SingUpCredentials) {
    try {
      const response = await api.post('account', {
        name,
        email,
        password
      });

      const { token } = response.data;

      setUser({
        name,
        email
      });

      const responseUploadIconImage = await api.patch('account/icon_image', {
        ...user,
        iconImageUrl: "PrefixIconImage"
      });

      const { iconImageUrl } = responseUploadIconImage.data.user.iconImageUrl;

      setUser({
        ...user,
        iconImageUrl
      });

      setCookie(undefined, 'next-simple-sns', token, {
        maxAge: 60 * 60 * 24, //24 hours;
        path: '/' //どのパスがこのクッキーをアクセスできるか。
      });

      setUser({
        name,
        email,
        iconImageUrl
      });

      // Headerにあるtokenの更新
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ login, singUp, isAuthenticated, user }}>
      { children }
    </AuthContext.Provider>
  )
}
