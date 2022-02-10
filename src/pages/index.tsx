import { useContext, useEffect, useState } from 'react';
import Router from "next/router";
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import Link from 'next/link';

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
  // const { singOut } = useContext(AuthContext);
  const [user, setUser] = useState<User>()
  const [posts, setPosts] = useState<Posts[]>([])



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
      {posts.length <= 0 &&
        <h2>
          投稿がありません初めての投稿者になりませんか？
          <Link href="/post">
            <a>Let's Post</a>
          </Link>
        </h2>
      }
      {user?.iconImageUrl  == null &&
        <img src="../profileIcon.png" alt="User Icon" />
      }
      <h1>name: {user?.name}</h1>

      {posts.map((post) => (
        <div key={post.id}>post: {post.body}</div>
      ))}
    </>
  );
}
