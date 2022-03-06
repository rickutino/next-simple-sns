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

interface Messages {
  id: number;
  roomId?: string;
  post?: Posts;
  postId?: number;
  user: User;
  userId?: number;
  content: string;
  createdAt: Date;
}

export default function useInfiniteScroll(url: string, urlType: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [ messages, setMessages ] = useState<Messages[]>([]);
  const [cursor, setCursor] = useState<number>();

  async function getPostsList() {
    setLoading(true)

    if(cursor === 1){
      setLoading(false);
      return;
    }

    try{
      switch(urlType) {
        case 'post':
          const postResponse = await api.get(`${url}&pagination[cursor]=${cursor}`)

          setCursor(postResponse.data.posts.pop().id);
          setPosts((prevPosts) => [...prevPosts, ...postResponse.data.posts]);
          break;
        case 'messages':
          const messageResponse = await api.get(`${url}&pagination[cursor]=${cursor}`)

          setCursor(messageResponse.data.messages.pop().id);
          setMessages((prevMessages) => [...prevMessages, ...messageResponse.data.messages]);
          break;
      }
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

  return { loading, error, posts, messages, setMessages };
}
