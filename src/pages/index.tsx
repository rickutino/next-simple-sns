import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';

import { Header, BottomHeaderNavigation } from '../components/Header';
import {
  Box,
  Theme,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AiFillPlusCircle } from 'react-icons/ai'

import useInfiniteScroll from '../components/InfiniteScroll';
import { parseCookies } from 'nookies';
import { api } from '../services/api';
import Post from '../components/Post';

interface User {
  id?: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

const useStyles = makeStyles((theme: Theme) => ({
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
  },
}));

export default function Home() {
  const [ currentUser, setCurrentUser ] = useState<User>();

  const classes = useStyles();

  const pageSize = 10;
  const url = `/posts?pagination[size]=${pageSize}`;
  const {
    loading,
    error,
    posts
  } = useInfiniteScroll(url, 'post');

  useEffect(() => {
    api.get('/account').then(response => {
      const { user } = response.data;

      setCurrentUser(user);
    }).catch((error) => {
      console.log(error);
    });
  }, []);


  return (
    <>
      <Header />
      {posts.map((post, i) => (
        <>
          <Post post={post} currentUser={currentUser}  />
        </>
      ))}
      <Box
        sx={{
          position: 'fixed',
          right: '20%',
          bottom: '10%',
        }}
        className={classes.iconButton}
      >
        <IconButton sx={{ fontSize: '3.5rem' }} color='secondary' href="/post" >
          <AiFillPlusCircle />
        </IconButton>
      </Box>
      <div id="scroll"></div>

      <BottomHeaderNavigation />
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
