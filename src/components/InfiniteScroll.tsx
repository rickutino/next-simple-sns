import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Messages } from '../shared/interfaces/messages.interface';
import { Posts } from '../shared/interfaces/posts.interface';

export default function useInfiniteScroll() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [cursor, setCursor] = useState<number>();
  const pageSize = 10;

  async function getPostsList() {
    setLoading(true);

    if (cursor === 1) {
      setLoading(false);
      return;
    }

    try {
      const postResponse = await api.get(
        `/posts?pagination[size]=${pageSize}&pagination[cursor]=${cursor}`
      );
      setCursor(postResponse.data.posts.pop().id);
      setPosts(prevPosts => [...prevPosts, ...postResponse.data.posts]);
    } catch (e) {
      console.log(e);
      setError(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(async entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        await getPostsList();
      }
    });
    intersectionObserver.observe(document.querySelector('#scroll'));
    return () => intersectionObserver.disconnect();
  }, [cursor]);

  return { loading, error, posts, messages, setMessages };
}
