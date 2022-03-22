import {
  Box, IconButton, styled
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BottomHeaderNavigation, Header } from '../components/Header';
import useInfiniteScroll from '../components/InfiniteScroll';
import Post from '../components/Post';
import { api } from '../services/api';
import theme from "../styles/theme";

interface User {
  id?: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

const ContainerRoot = styled(Box)({
  backgroundColor: theme.palette.primary.main,
});

const NewPostButton = styled(Box)({
  position: 'fixed',
  right: '20%',
  bottom: '10%',
  '& svg': {
    color: theme.palette.secondary.main,
  },
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
});

export default function Home() {
  const [ currentUser, setCurrentUser ] = useState<User>();

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
    <ContainerRoot>
      <Header />
      {posts.map((post) => (
        <>
          <Post key={post.id} post={post} currentUser={currentUser}  />
        </>
      ))}
      <NewPostButton>
        <IconButton sx={{ fontSize: '3.5rem' }} color='secondary' href="/post" >
          <AiFillPlusCircle />
        </IconButton>
      </NewPostButton>
      <div id="scroll"></div>

      <BottomHeaderNavigation />
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </ContainerRoot>
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
