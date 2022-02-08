import { useEffect, useState } from 'react';
import { api } from '../services/api';

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
  const [user, setUser] = useState<User>()
  const [posts, setPosts] = useState<Posts[]>([])


  useEffect(() => {
    api.get('/posts').then(response => {

      setPosts(response.data.posts);
    });

    api.get('/account').then(response => {
      const { name, email, iconImageUrl } = response.data.user;

      setUser({ name, email, iconImageUrl })
    })
  },[]);

  return (
    <>
      <img src={user.iconImageUrl} alt="User Image" />
      <h1>name: {user.name}</h1>

      {posts.map((post) => (
        <div key={post.id}>post: {post.body}</div>
      ))}
    </>
  );
}
