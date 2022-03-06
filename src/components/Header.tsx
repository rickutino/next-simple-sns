import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { FiHome, FiPower } from 'react-icons/fi';
import { RiAccountCircleLine } from 'react-icons/ri';
import { AuthContext } from '../contexts/AuthContext';
import Notification from './Notification';
import { api } from '../services/api';
import { Container, HeaderContent, Profile, Info } from '../styles/Header';
import ConfirmDialog from './ConfirmDialog';

interface User {
  name: string;
  email: string;
  iconImageUrl?: string | null
}

export default function Header() {
  const { signOut, notify, setNotify, confirmDialog, setConfirmDialog } = useContext(AuthContext);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    api.get('/account').then(response => {
      const { name, email, iconImageUrl } = response.data.user;

      setUser({ name, email, iconImageUrl })
    }).catch((error) => {
      console.log(error);
    });
  },[]);

  return (
    <>
      <Container>
        <HeaderContent>
          <img
            src={'/logo.svg'}
            alt="simple-sns"
          />
          <Profile>
            <img src={
              user?.iconImageUrl
              ? user.iconImageUrl
              : `/icons/profileIcon.png` }
            />
            <Info>
              <span>Welcome, </span>
              <Link href="/profile">
                <strong>{user?.name}</strong>
              </Link>
            </Info>
          </Profile>

          <nav>
            <Link href="/profile">
              <FiHome />
            </Link>
            <Link href="/room">
              <RiAccountCircleLine />
            </Link>
            <button className='logout' onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: "ログアウトしてもよろしいでしょうか？",
                onConfirm: () => { signOut() }
              });
            }} >
              <FiPower color={"#E0483D"}/>
            </button>
          </nav>
        </HeaderContent>
      </Container>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  )
}
