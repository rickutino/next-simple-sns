import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Container,
  Link,
  styled
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { FiHome, FiPower } from 'react-icons/fi';
import { ImProfile } from 'react-icons/im';
import { IoIosPeople } from 'react-icons/io';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import theme from '../styles/theme';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';

const BoxRoot = styled(Box)({
  backgroundColor: theme.palette.primary.dark,
  width: '100%',
  height: '8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
});

const HeaderContainer = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& > img': {
    height: '42px'
  },
  '& > div': {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '48px',
    '& > img': {
      width: '48px',
      height: '48px',
      borderRadius: '50%'
    },
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '16px',
      lineHeight: '24px',
      '& > span': {
        color: '#999591'
      },
      '& > a': {
        textDecoration: 'none',
        '&:hover': {
          opacity: '0.8'
        },
        '& strong': {
          color: theme.palette.secondary.main
        }
      }
    }
  },
  '& nav': {
    marginLeft: 'auto',
    display: 'flex',
    height: '100%',
    width: '265px',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& svg': {
      color: theme.palette.grey[200],
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      '&:hover': {
        opacity: '0.8'
      }
    },
    '& button.logout': {
      background: 'transparent',
      border: '0'
    }
  }
});

const MobileTopHeader = styled(Box)({
  backgroundColor: theme.palette.primary.dark,
  height: '8rem',
  width: '100%',
  padding: '0 2rem',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  top: '0',
  [theme.breakpoints.up('md')]: {
    display: 'none'
  },
  '& div': {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '48px'
  },
  '& > div': {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '16px',
    lineHeight: '24px',
    '& > span': {
      color: theme.palette.grey[200],
      fontSize: '20px'
    },
    '& > a': {
      textDecoration: 'none',
      '&:hover': {
        opacity: '0.8'
      },
      '& strong': {
        color: theme.palette.secondary.main,
        fontSize: '22px'
      }
    }
  }
});

const AvatarHeader = styled(Avatar)({
  width: '56px',
  height: '56px',
  borderRadius: '50%'
});

const MobileBottomHeader = styled(Box)({
  width: '100%',
  position: 'fixed',
  bottom: '0',
  [theme.breakpoints.up('md')]: {
    display: 'none'
  },
  '& MuiBottomNavigation-root': {
    display: 'flex',
    justifyContent: 'space-around'
  }
});

export function Header() {
  const {
    signOut,
    notify,
    setNotify,
    confirmDialog,
    setConfirmDialog,
    setUser,
    user
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/account')
      .then(response => {
        const { id, name, email, iconImageUrl } = response.data.user;

        setUser({ id, name, email, iconImageUrl });
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {!loading && (
        <BoxRoot>
          <HeaderContainer maxWidth="lg">
            <img src="/logo.svg" alt="simple-sns" />
            <div>
              <AvatarHeader alt="" src={user?.iconImageUrl} />
              <div>
                <span>Welcome, </span>
                <Link href="/profile">
                  <strong>{user?.name}</strong>
                </Link>
              </div>
            </div>

            <nav>
              <Link href="/">
                <FiHome />
              </Link>
              <Link href="/profile">
                <ImProfile />
              </Link>
              <Link href="/room">
                <IoIosPeople />
              </Link>
              <button
                type="submit"
                className="logout"
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: 'ログアウトしてもよろしいでしょうか？',
                    onConfirm: () => {
                      signOut();
                    }
                  });
                }}
              >
                <FiPower color="#E0483D" />
              </button>
            </nav>
          </HeaderContainer>
        </BoxRoot>
      )}
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

export function BottomHeaderNavigation() {
  const { signOut, confirmDialog, setConfirmDialog, user } =
    useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      {}
      {!loading && (
        <>
          <MobileTopHeader>
            <div>
              <span>Welcome, </span>
              <Link href="/profile">
                <strong>{user?.name}</strong>
              </Link>
            </div>
            <AvatarHeader alt="" src={user?.iconImageUrl} />
          </MobileTopHeader>
          <MobileBottomHeader>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{
                justifyContent: 'space-around',
                '& svg': {
                  width: '28px',
                  height: '28px'
                }
              }}
            >
              <Button href="/" component={Link}>
                <BottomNavigationAction icon={<FiHome />} />
              </Button>
              <Button href="/profile" component={Link}>
                <BottomNavigationAction icon={<ImProfile />} />
              </Button>
              <Button href="/room" component={Link}>
                <BottomNavigationAction icon={<IoIosPeople />} />
              </Button>
              <Button>
                <BottomNavigationAction
                  icon={<FiPower color="#E0483D" />}
                  className="logout"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'ログアウトしてもよろしいでしょうか？',
                      onConfirm: () => {
                        signOut();
                      }
                    });
                  }}
                />
              </Button>
            </BottomNavigation>
          </MobileBottomHeader>
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </>
      )}
    </>
  );
}
