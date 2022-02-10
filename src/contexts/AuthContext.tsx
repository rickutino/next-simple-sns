import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies, setCookie } from 'nookies';
import { useRouter } from "next/router";
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
  user: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('popstate', function(e) {
      router.push('/');
    });
    // cleanup this component
    return () => {
      window.removeEventListener('popstate', function(e) {});
    };
  }, []);

  useEffect(() => {
    const { 'next-simple-sns': token } = parseCookies();

    if(!!token) {
      router.push('/')
    };

    if(token) {
      api.get('/account').then(response => {
        const { name, email, iconImageUrl } = response.data.user;

        setUser({ name, email, iconImageUrl })
      }).catch((error) => {
      console.log(error);
    });
    }
  }, [])

  async function login({ email, password }: LoginCredentials) {
    try {
      const response = await api.post('auth', {
        email,
        password
      });

      const { token, user: { name, iconImageUrl} } = response.data;

      setCookie(undefined, 'next-simple-sns', token, {
        maxAge: 60 * 60 * 24, //24 hours;
        path: '/' //どのパスがこのクッキーをアクセスできるか。
      });

      setUser({
        name, email, iconImageUrl
      });

      // Headerにあるtokenの更新
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      router.push('/')
    } catch (err) {
      console.log(err);
    }
  }

  async function singUp({ name, email, password }: SingUpCredentials) {
    try {
      const response = await api.post('account', {
        name,
        email,
        password
      });

      setUser({
        name,
        email
      });

      const { token } = response.data;

      setCookie(undefined, 'next-simple-sns', token, {
        maxAge: 60 * 60 * 24, //24 hours;
        path: '/' //どのパスがこのクッキーをアクセスできるか。
      });

      // Headerにあるtokenアクセスの更新をさせる。
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      router.push('/')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ login, singUp, user }}>
      { children }
    </AuthContext.Provider>
  )
}
