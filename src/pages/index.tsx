import { useEffect, useState } from 'react';
import { api } from '../services/api';

import ImageIcon from '../styles/ImageIcon';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { AppBar, Container, Toolbar, Box, IconButton, Avatar, ListItem, ListItemAvatar, Card, CardHeader, Typography } from '@mui/material';
import Image from 'next/image';
import theme from '../styles/theme';

interface User {
  name: string;
  email: string;
  iconImageUrl?: string | null
}

interface Posts {
  id: number;
  body: string;
}

export default function Home() {
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    api.get('/posts').then(response => {

      setPosts(response.data.posts);
    }).catch((error) => {
      console.log(error)
    });

    api.get('/account').then(response => {
      const { name, email, iconImageUrl } = response.data.user;
      console.log(name)
      setUser({ name, email, iconImageUrl })
    }).catch((error) => {
      console.log(error);
    });
  },[]);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ mr: 8, display: { xs: 'none', md: 'flex' } }}>
              <Image
                src={`/logo.svg`}
                alt="logo"
                width={200}
                height={144}
              />
              <Avatar alt="current_user" src="/icons/profileIcon.png" sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography>Welcome</Typography>
                <Typography>{user.name}</Typography>
              </Box>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
      <ImageIcon
        src={`/icons/profileIcon.png`}
        alt="User Icon"
        width={160}
        height={160}
      />
      <h1>name: {user?.name}</h1>

      {posts.map((post) => (
        <div key={post.id}>post: {post.body}</div>
      ))}
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
