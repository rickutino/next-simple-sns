import Router, { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { api } from "../services/api";


interface User {
  id?: string;
  name?: string;
  email: string;
  iconImageUrl?: string | null;
}
interface Notification {
  isOpen: boolean;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface DialogData {
  isOpen: boolean,
  title: string;
  onConfirm?(): void;
};

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
  signOut(): void,
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  notify: Notification;
  setNotify: Dispatch<SetStateAction<Notification>>;
  confirmDialog: DialogData;
  setConfirmDialog: Dispatch<SetStateAction<DialogData>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [notify, setNotify] = useState({isOpen: false, message: "", type: null})
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: ""});
  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('popstate', function(e) {
      router.push('/');
    });

    return () => {
      window.removeEventListener('popstate', function(e) {});
    };
  }, []);

  useEffect(() => {
    api.get('/account').then(response => {
      const { name, email, iconImageUrl } = response.data.user;

      setUser({ name, email, iconImageUrl })
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  function signOut() {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })

    api.delete('/auth').then(() => {
      destroyCookie(undefined, 'next-simple-sns');

      Router.push('/account/login');

      setNotify({
        isOpen: true,
        message: "ログアウトしました、また遊びに来てください。",
        type: 'success'
      });
    }).catch(() => {
      setNotify({
        isOpen: true,
        message: "お手数ですが再ログインしていただくかしばらくお待ちください。",
        type: 'error'
      });

      return;
    });
  }

  async function login({ email, password }: LoginCredentials) {
    await api.post('auth', {
      email,
      password
    }).then(response => {
      const { token, user: { name, iconImageUrl}} = response.data;

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

    }).catch(() => {
      setNotify({
        isOpen: true,
        message: "メールアドレスかパスワードが間違っています",
        type: 'error'
      });
    });
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
      setNotify({
        isOpen: true,
        message: "このメールアドレスは既に使われています。",
        type: 'error'
      });
    }
  }

  return (
    <AuthContext.Provider value={{
      login,
      singUp,
      signOut,
      user,
      setUser,
      notify,
      setNotify,
      confirmDialog,
      setConfirmDialog
    }}>
      { children }
    </AuthContext.Provider>
  )
}
