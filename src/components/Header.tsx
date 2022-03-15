import { useContext, useEffect, useState } from 'react';
import { FiHome, FiPower } from 'react-icons/fi';
import { RiAccountCircleLine } from 'react-icons/ri';
import { AuthContext } from '../contexts/AuthContext';
import Notification from './Notification';
import { api } from '../services/api';
import { HeaderContent, Profile, Info } from '../styles/Header';
import ConfirmDialog from './ConfirmDialog';
import { BottomNavigation, BottomNavigationAction, Box, Container, Link, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface User {
  name: string;
  email: string;
  iconImageUrl?: string | null
}

const useStyles = makeStyles((theme: Theme) => ({
  topRoot: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  bottomRoot: {
    width: '100%',
    position: 'fixed',
    bottom: '0',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export function Header() {
  const { signOut, notify, setNotify, confirmDialog, setConfirmDialog } = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    api.get('/account').then(response => {
      const { name, email, iconImageUrl } = response.data.user;

      setUser({ name, email, iconImageUrl });
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    });
  },[]);

  return (
    <>
      {!loading &&
        <Container maxWidth="xl" >
          <Box className={classes.topRoot}>
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
          </Box>
        </Container>
      }
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

export function BottomHeaderNavigation() {
  const { signOut,  confirmDialog, setConfirmDialog } = useContext(AuthContext);
  const classes = useStyles();
  const [value, setValue] = useState(0);

  return (
    <>
      <Box  className={classes.bottomRoot}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            justifyContent: 'space-around',
            '& svg':{
              width: '28px',
              height: '28px'
            },
          }}
        >
          <Link href="/profile">
            <a>
              <BottomNavigationAction icon={<FiHome />}/>
            </a>
          </Link>
          <Link href="/room">
            <a>
              <BottomNavigationAction icon={<RiAccountCircleLine />} />
            </a>
          </Link>
          <BottomNavigationAction icon={<FiPower color={"#E0483D"}/>} className='logout'  onClick={() => {
            setConfirmDialog({
              isOpen: true,
              title: "ログアウトしてもよろしいでしょうか？",
              onConfirm: () => { signOut() }
            });
          }}/>
        </BottomNavigation>
      </Box>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
