import { AxiosResponse } from 'axios';
import Router, { useRouter } from 'next/router';
import { destroyCookie, setCookie } from 'nookies';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { api } from '../services/api';

import { IUser } from '../shared/interfaces/user.interface';
import { tokenKey } from '../shared/const';


interface AxiosResponseData {
  user: IUser;
}
interface Notification {
  isOpen: boolean;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface DialogData {
  isOpen: boolean;
  title: string;
  onConfirm?(): void;
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
  signOut(): void;
  user: IUser;
  setUser: Dispatch<SetStateAction<IUser>>;
  notify: Notification;
  setNotify: Dispatch<SetStateAction<Notification>>;
  confirmDialog: DialogData;
  setConfirmDialog: Dispatch<SetStateAction<DialogData>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [notify, setNotify] = useState<Notification>({
    isOpen: false,
    message: '',
    type: null
  });
  const [confirmDialog, setConfirmDialog] = useState<DialogData>({
    isOpen: false,
    title: ''
  });
  const [user, setUser] = useState<IUser>();
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('popstate', () => {
      router.push('/');
    });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  useEffect(() => {
    api
      .get<AxiosResponseData>('/account')
      .then(response => {
        const { id, name, email, iconImageUrl } = response.data.user;

        setUser({ id, name, email, iconImageUrl });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function signOut() {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });

    api
      .delete<AxiosResponse>('/auth')
      .then(() => {
        destroyCookie(undefined, 'next-simple-sns');

        Router.push('/account/login');

        setNotify({
          isOpen: true,
          message: 'ログアウトしました、また遊びに来てください。',
          type: 'success'
        });
      })
      .catch(() => {
        setNotify({
          isOpen: true,
          message:
            'お手数ですが再ログインしていただくかしばらくお待ちください。',
          type: 'error'
        });
      });
  }

  async function login({ email, password }: LoginCredentials) {
    await api
      .post('auth', {
        email,
        password
      })
      .then(response => {
        const { token } = response.data;

        setCookie(undefined, tokenKey, token, {
          maxAge: 60 * 60 * 24, // 24 hours;
          path: '/' // どのパスでもこのクッキーにアクセスできる。
        });

        router.push('/');
      })
      .catch(() => {
        setNotify({
          isOpen: true,
          message: 'メールアドレスかパスワードが間違っています',
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

      const { token } = response.data;

      setCookie(undefined, tokenKey, token, {
        maxAge: 60 * 60 * 24, // 24 hours;
        path: '/' // どのパスでもこのクッキーにアクセスできる。
      });

      router.push('/');
    } catch (error) {
      setNotify({
        isOpen: true,
        message: 'このメールアドレスは既に使われています。',
        type: 'error'
      });
    }
  }

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        login,
        singUp,
        signOut,
        user,
        setUser,
        notify,
        setNotify,
        confirmDialog,
        setConfirmDialog
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
