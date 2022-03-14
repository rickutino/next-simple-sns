import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Link,
  Typography,
  Theme
} from "@mui/material";
import { GetServerSideProps } from 'next';

import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { Header, BottomHeaderNavigation } from "../../components/Header";
import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/AuthContext";
import { parseCookies } from 'nookies';
import { api } from "../../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: theme.palette.primary.main,
    boxShadow: 'none',
  },
  text: {
    color: theme.palette.secondary.main,
  },
  subText: {
    color: theme.palette.grey[400],
  },
  avatar: {
    margin: '0 auto',
  }
}));

export default function Profile() {
  const { notify, setNotify } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState<User>();
  const classes = useStyles();


  useEffect(() => {
    api.get("/account").then(response => {
      console.log(response.data.user);
      setCurrentUser(response.data.user);
    })
  }, []);

  return (
    <div className={classes.root}>
      <Header />

      <Container maxWidth="md" className={classes.root}>
        <Link href="/profile/update">
          <Typography variant="h4" align="right" className={classes.text} mb={2} mt={4}>
            編集
          </Typography>
        </Link>
        <Avatar
          className={classes.avatar}
          alt={currentUser?.name}
          sx={{ width: 185, height: 185 }}
          src={
            currentUser?.iconImageUrl
            ? currentUser.iconImageUrl
            : `/icons/profileIcon.png` }
        />
        <Box>
          <Typography variant="h4" align="center" className={classes.text} mt={8} mb={2}>
            {currentUser?.name}
          </Typography>
          <Typography variant="h6" align="center" className={classes.subText} mb={2}>
            {currentUser?.email}
          </Typography>
        </Box>
      </Container>

      <BottomHeaderNavigation />
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['next-simple-sns']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
