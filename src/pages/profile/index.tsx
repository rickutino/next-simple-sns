import {
  Avatar,
  Box,
  Container,
  Link,
  styled,
  Typography
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { BottomHeaderNavigation, Header } from '../../components/Header';
import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { tokenKey } from '../../shared/const';
import theme from '../../styles/theme';

const Root = styled(Box)({
  background: theme.palette.primary.main,
  boxShadow: 'none',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    paddingTop: '8rem'
  }
});

const WhenMobileDisplayNoneHeader = styled(Box)({
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
});

export default function Profile() {
  const { notify, setNotify, user } = useContext(AuthContext);

  return (
    <Root>
      <WhenMobileDisplayNoneHeader>
        <Header />
      </WhenMobileDisplayNoneHeader>

      <Container maxWidth="md">
        <Link href="/profile/update">
          <Typography
            variant="h4"
            align="right"
            sx={{ color: theme.palette.secondary.main }}
            mb={4}
            mt={6}
          >
            編集
          </Typography>
        </Link>
        <Avatar
          sx={{ margin: '0 auto', width: 185, height: 185 }}
          alt={user?.name}
          src={user?.iconImageUrl}
        />
        <Box>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: theme.palette.secondary.main }}
            mt={8}
            mb={2}
          >
            {user?.name}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: theme.palette.grey[400] }}
            mb={2}
          >
            {user?.email}
          </Typography>
        </Box>
      </Container>

      <BottomHeaderNavigation />
      <Notification notify={notify} setNotify={setNotify} />
    </Root>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const currentUserToken = parseCookies(ctx);

  if (!currentUserToken[tokenKey]) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
