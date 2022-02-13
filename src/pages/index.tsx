import { useEffect, useState } from 'react';
import { api } from '../services/api';

import ImageIcon from '../styles/ImageIcon';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { AppBar, Container, Toolbar, Box, IconButton, Avatar, ListItem, ListItemAvatar, Card, CardHeader, Typography } from '@mui/material';
import Image from 'next/image';
import theme from '../styles/theme';
import Header from '../components/Header';

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

      setUser({ name, email, iconImageUrl })
    }).catch((error) => {
      console.log(error);
    });
  },[ ]);


  return (
    <>
      <Header />

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
