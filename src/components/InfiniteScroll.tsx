import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

interface Posts {
  id: number;
  body: string;
  createdAt?: Date;
  user: User
}

export default function useInfiniteScroll(pageSize: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [cursor, setCursor] = useState<number>();

  async function getPostsList() {
    setLoading(true)

    if(cursor === 1){
      setLoading(false);
      return;
    }

    try{
      const response = await api.get(`/posts?pagination[size]=${pageSize}&pagination[cursor]=${cursor}`)

      setCursor(response.data.posts.pop().id);
      setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
    } catch (e) {
      console.log(e);
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(async entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        await getPostsList();
      }
    });
    intersectionObserver.observe(document.querySelector('#scroll'));
    return () => intersectionObserver.disconnect();
  }, [cursor]);

  return { loading, error, posts };
}
