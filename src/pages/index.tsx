import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  Theme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AiFillPlusCircle } from 'react-icons/ai'


import Header, { BottomHeaderNavigation } from '../components/Header';
import useInfiniteScroll from '../components/InfiniteScroll';
import { AuthContext } from '../contexts/AuthContext';
import Notification from '../components/Notification';
import { parseCookies } from 'nookies';
import { api } from '../services/api';

interface User {
  id?: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

interface Posts {
  id?: number;
  body: string;
  createdAt?: Date;
  user: User
}

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  textField: {
    borderRadius: '5px',
    backgroundColor: theme.palette.grey[200],
  },
  button: {
    borderRadius: '50px',
    height: '3.5rem',
    width: '16rem',
  },
  iconButton: {
    [theme.breakpoints.down('lg')]: {
      position: 'fixed',
      right: '4%',
      bottom: '10%',
    },
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
      right: '2%',
      bottom: '10%',
    },
    position: 'fixed',
    right: '20%',
    bottom: '10%',
  },
}))

function jaTimeZone (hours) {
  const dateToTime = date => date.toLocaleString('ja', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  const dateString = hours;
  const localDate = new Date(dateString);

  return dateToTime(localDate);
}

export default function Home() {
  const { notify, setNotify } = useContext(AuthContext);
  const [ comment, setComment ] = useState('');
  const [ inputValue, setInputValue ] = useState(true);
  const [ commentError, setCommentError ] = useState(false);
  const [ user, setUser ] = useState<User>();

  const pageSize = 10;
  const url = `/posts?pagination[size]=${pageSize}`;
  const {
    loading,
    error,
    posts
  } = useInfiniteScroll(url, 'post');


  const router = useRouter();
  const classes = useStyles();

  function handleChange ( event: React.ChangeEvent<HTMLInputElement> ) {
    setComment(event.target.value);
    setInputValue(false);
  }

  async function handleSubmit ( event: FormEvent, post: Posts) {
    event.preventDefault();
    setCommentError(false);

    if(comment == '') {
      setCommentError(true);
      setNotify({
        isOpen: true,
        message: "コメントは必須です。",
        type: 'error'
      });
    }

    try{
      const response = await api.post('/messages/via_post', {
        content: comment,
        postId: post.id
      });
      const roomId = response.data.message.roomId;
      router.push(`/message/${roomId}`)
    }catch (error) {
      setNotify({
        isOpen: true,
        message: `${error}`,
        type: 'error'
      });
    }
  }

  useEffect(() => {
    api.get('/account').then(response => {
      const { user } = response.data;

      setUser(user);
    }).catch((error) => {
      console.log(error);
    });
  }, []);


  return (
    <>
      <Header />
      <Box className={classes.iconButton}>
        <IconButton sx={{ fontSize: '3.5rem' }} color='secondary' href="/post" >
          <AiFillPlusCircle />
        </IconButton>
      </Box>
      {posts.map((post, i) => (
        <>
          <Grid
            key={i}
            sx={{
              mx: 'auto',
              mb: 8,
              maxWidth: 735,
            }}
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Card
              sx={{
              width: '100%',
              px: 10,
              py: 2,
              backgroundColor: (theme) => theme.palette.primary.light,
              color: (theme) => theme.palette.grey[200],
            }}>
              <CardHeader
                avatar={
                  <Avatar
                    alt={post.user?.name}
                    src={
                      user?.iconImageUrl
                      ? user.iconImageUrl
                      : `/icons/profileIcon.png` }
                  />
                }
                title={<Typography variant='h6'>{post.user?.name}</Typography>}
                subheader={<Typography>{jaTimeZone(post.createdAt)}</Typography>}
              />
              <CardContent sx={{
                flex: 1,
                color: (theme) => theme.palette.grey[200],
                }}>
                <Typography variant="body1">
                  {post.body}
                </Typography>
              </CardContent>
            </Card>
            { post.user.id != user?.id &&
              <form className={classes.form} onSubmit={e => handleSubmit(e , post)}>
                <TextField
                  id={String(i)}
                  className={classes.textField}
                  variant="outlined"
                  multiline
                  fullWidth
                  onChange={handleChange}
                  error={commentError}
                />
                <Button
                  id={String(i)}
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  disabled={inputValue}
                  color="secondary"
                >
                  DMを送信
                </Button>
              </form>
            }
          </Grid>
        </>
      ))}
      <div id="scroll"></div>

      <BottomHeaderNavigation />
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  );
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
