import { useEffect, useState } from 'react';

import { api } from '../services/api';

import Link from 'next/link';
import ImageIcon from '../components/ImageIcon';
import { GetServerSideProps } from 'next';
import { getAPIClient } from '../services/axios';
import { parseCookies } from 'nookies';

interface User {
  name: string;
  email: string;
  iconImageUrl?: string | null
}

interface Posts {
  id: number;
  body: string;
}

interface HomeProps {
  user: User;
  posts: Posts[];
}

export default function Home({ posts, user }: HomeProps) {
  return (
    <>
      {/* {posts.length <= 0 &&
        <h2>
          投稿がありません初めての投稿者になりませんか？
          <Link href="/post">
            <a>Let's Post</a>
          </Link>
        </h2>
      } */}
      {user?.iconImageUrl  == null &&
        <ImageIcon
          src={`/icons/profileIcon.png`}
          alt="User Icon"
          width={160}
          height={160}
        />
      }
      <h1>name: {user?.name}</h1>

      {posts.map((post) => (
        <div key={post.id}>post: {post.body}</div>
      ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const apiClient = getAPIClient(ctx);

  const postsResponse = await apiClient.get('/posts');
  const posts = await postsResponse.data.posts;

  const userResponse = await apiClient.get('/account');
  const user = await userResponse.data.user;

  return {
    props: {
      posts,
      user
    }
  }
}
