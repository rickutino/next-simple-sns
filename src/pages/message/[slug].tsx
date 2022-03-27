import { Box, Button, Container, styled, TextField } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { BottomHeaderNavigation, Header } from '../../components/Header';
import {
  MessageLeft,
  MessageRight,
  PostContext
} from '../../components/Message';
import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import theme from '../../styles/theme';

interface User {
  id: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

interface Posts {
  id: number;
  userId: number;
  body: string;
  createdAt?: string;
}

interface Messages {
  id: number;
  roomId?: string;
  post?: Posts;
  postId?: number;
  user: User;
  userId?: number;
  content: string;
  createdAt: string;
}

const Root = styled(Box)({
  background: theme.palette.primary.main,
  boxShadow: 'none',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(14)
  }
});

const MessageContainer = styled(Container)({
  paddingTop: theme.spacing(4),
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const MessageBody = styled(Box)({
  backgroundColor: theme.palette.primary.light,
  borderRadius: '5px',
  width: '100%',
  overflowY: 'scroll',
  height: 'calc( 100% - 140px )'
});

const MessageForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
});

const MessageInput = styled(TextField)({
  borderRadius: '5px',
  backgroundColor: theme.palette.grey[200]
});

const MessageButton = styled(Button)({
  marginTop: theme.spacing(2),
  borderRadius: '5px',
  height: '3.5rem',
  width: '100%'
});

export default function Message() {
  const { notify, setNotify, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [messagesError, setMessagesError] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [inputValue, setInputValue] = useState(true);

  let cursorIndex = 0;
  let allMessages = [];
  let messageIndex = null;
  let pageSize = 10;
  const messagesEndRef = useRef(null);
  const firstUpdate = useRef(true);
  const router = useRouter();
  const roomId = router.query.slug;

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function getRemainingMessage() {
    if (messageIndex > pageSize) {
      messageIndex -= pageSize;
      cursorIndex = allMessages[messageIndex].id;
    } else {
      pageSize = messageIndex + 1;
      messageIndex = 0;

      cursorIndex = 1;
    }
  }

  async function getPostsList() {
    setLoading(true);

    if (messageIndex === 0) {
      setLoading(false);

      return;
    }

    // オールメッセージのリストの最後のエレメントの取得。
    if (firstUpdate.current) {
      const response = await api.get(
        `/messages?roomId=${roomId}&pagination[order]=ASC`
      );

      allMessages = response.data.messages;
      messageIndex = allMessages.length - 1;
      firstUpdate.current = false;
    }

    try {
      getRemainingMessage();
      const messageResponse = await api.get(
        `/messages?pagination[size]=${pageSize}&pagination[order]=ASC&roomId=${roomId}&pagination[cursor]=${cursorIndex}`
      );

      setMessages(prevMessages => [
        ...messageResponse.data.messages,
        ...prevMessages
      ]);
    } catch (e) {
      console.log(e);
      setError(true);
    }

    setLoading(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputMessage(event.target.value);
    setInputValue(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessagesError(false);

    if (inputMessage === '') {
      setMessagesError(true);
      setNotify({
        isOpen: true,
        message: 'メッセージは必須です。',
        type: 'error'
      });
    }

    try {
      const response = await api.post('/messages', {
        content: inputMessage,
        roomId
      });
      setMessages(prevMessage => [...prevMessage, response.data.message]);
    } catch (err) {
      setNotify({
        isOpen: true,
        message: `${err}`,
        type: 'error'
      });
    }

    setInputMessage('');
  }

  useEffect(() => {
    if (!router.isReady) return;

    const intersectionObserver = new IntersectionObserver(async entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        await getPostsList();
      }
    });
    intersectionObserver.observe(document.querySelector('#scroll'));
    // eslint-disable-next-line consistent-return
    return () => intersectionObserver.disconnect();
  }, [router.isReady]);

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <Root>
      <Header />
      <MessageContainer maxWidth="sm">
        <MessageBody>
          <div id="scroll" />
          {messages.map((message: Messages) => {
            return message.user.id === user.id ? (
              <>
                <PostContext post={message.post} />
                <MessageRight
                  key={message.id}
                  user={message.user}
                  content={message.content}
                  createdAt={message.createdAt}
                />
              </>
            ) : (
              <>
                <PostContext post={message.post} />
                <MessageLeft
                  key={message.id}
                  user={message.user}
                  content={message.content}
                  createdAt={message.createdAt}
                />
              </>
            );
          })}
          <div ref={messagesEndRef} />
        </MessageBody>
        <MessageForm onSubmit={e => handleSubmit(e)}>
          <MessageInput
            variant="outlined"
            multiline
            fullWidth
            onChange={handleChange}
            value={inputMessage}
            error={messagesError}
          />
          <MessageButton
            type="submit"
            variant="contained"
            disabled={inputValue}
            color="secondary"
          >
            メッセージを送信
          </MessageButton>
        </MessageForm>
      </MessageContainer>

      <Notification notify={notify} setNotify={setNotify} />
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
      <BottomHeaderNavigation />
    </Root>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { 'next-simple-sns': token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
