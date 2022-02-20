import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface User {
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
  const [hasMore, setHasMore] = useState<number>(0);
  const [cursor, setCursor] = useState<number>();
  const [posts, setPosts] = useState<Posts[]>([]);

  // useEffect(() => {
  //   setLoading(true)
  //   setError(false)
  //   let lastPost;

  //   api({
  //     method: 'GET',
  //     url: `/posts?pagination[size]=${pageSize}&pagination[cursor]=${cursor}`,
  //   }).then(response => {
  //     setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);

  //     lastPost = response.data.posts.pop();
  //     setCursor(() => lastPost.id +1);

  //     setLoading(false)
  //   }).catch(() => {
  //     setError(true)
  //   });
  // },[hasMore]);

  useEffect(() => {
    setLoading(true)
    setError(false)
    let lastPost;

    async function getPostsList() {
      try{
        const response = await api.get(`/posts?pagination[size]=${pageSize}&pagination[cursor]=${cursor}`)

        console.log("prevSet", posts)
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        console.log("set",posts)

        lastPost = response.data.posts.pop();
        setCursor(lastPost.id);
        console.log("cursor", cursor);
      } catch (e) {
        console.log(e);
        setError(true)
      }

      setLoading(false)
    };

    getPostsList();
  }, [hasMore]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setHasMore(() => cursor +1);
      }
    })
    intersectionObserver.observe(document.querySelector('#scroll'));
    return () => intersectionObserver.disconnect();
  }, []);

  return { loading, error, posts };
}
