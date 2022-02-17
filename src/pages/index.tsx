import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

import { api } from '../services/api';

import { parseCookies } from 'nookies';
import Header from '../components/Header';
import useInfiniteScroll from '../components/InfiniteScroll';

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

  const {
    loading,
    error,
    posts
  } = useInfiniteScroll(10);

  return (
    <>
      <Header />
      {posts.map((post) => (
        <>
          <Grid
            key={post.id}
            sx={{
              mx: 'auto',
              mb: 3,
              maxWidth: 735,
            }}
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Card sx={{
              width: '100%',
              px: 10,
              py: 2,
              backgroundColor: (theme) => theme.palette.primary.light,
              color: (theme) => theme.palette.grey[200],
            }}>
              <CardHeader
                avatar={
                  <Avatar
                    src={post.user.iconImageUrl}
                    alt={post.user.name}
                  />
                }
                action={
                  <Link href="/" >
                    <ChatOutlinedIcon
                      color="secondary"
                      fontSize='large'
                    />
                  </Link>
                }
                title={<Typography variant='h6'>{post.user.name}</Typography>}
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
          </Grid>
        </>
      ))}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
      <div id="scroll"></div>
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
