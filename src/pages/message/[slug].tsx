import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useRef, useState } from 'react';

import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { parseCookies } from 'nookies';
import { api } from '../../services/api';

import Header, { BottomHeaderNavigation } from '../../components/Header';
import { makeStyles } from '@mui/styles';
import { Box, Button, Container, TextField, Theme } from '@mui/material';
import { MessageLeft, MessageRight, PostContext } from '../../components/Message';

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
  createdAt?: Date;
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

const useStyles = makeStyles((theme: Theme) =>({
  container: {
    height: '75vh',
    alignItems: "center",
    flexDirection: "column",
    position: "relative"
  },
  messagesBody: {
    width: "calc( 100% - 20px )",
    margin: 10,
    overflowY: "scroll",
    height: "calc( 100% - 80px )",
    // '& #scroll': {
    //   display: 'none',
    // }
  },
  form: {
    display: 'flex',
    width: '100%',
  },
  textField: {
    borderRadius: '5px',
    backgroundColor: theme.palette.grey[200],
  },
  button: {
    borderRadius: '50px',
    height: '3.5rem',
    width: '100%',
  },
}));

export default function Message() {
  const { notify, setNotify } = useContext(AuthContext);
  const [ currentUser, setCurrentUser ] = useState<User>();
  const [ cursor, setCursor ] = useState<number>();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ messages, setMessages ] = useState<Messages[]>([]);
  const [ inputValue, setInputValue ] = useState(true);
  const [ inputMessage, setInputMessage ] = useState('')
  const [ messagesError, setMessagesError ] = useState(false);

  const messagesEndRef = useRef(null)
  const classes = useStyles();
	const router = useRouter();
  const roomId = router.query.slug;

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function getPostsList() {
    setLoading(true);
    const pageSize = 10;


    if(cursor === 1){
      setLoading(false);
      return;
    }

    try{
      const messageResponse = await api.get(`/messages?pagination[size]=${pageSize}&pagination[order]=ASC&roomId=${roomId}&pagination[cursor]=${cursor}`)

      setCursor(messageResponse.data.messages.pop().id);
      setMessages((prevMessages) => [...prevMessages, ...messageResponse.data.messages]);

    } catch (e) {
      console.log(e);
      setError(true);
    }

    setLoading(false);
  };

  function handleChange ( event: React.ChangeEvent<HTMLInputElement> ) {
    setInputMessage(event.target.value);
    setInputValue(false);
  }

  async function handleSubmit ( event: FormEvent) {
    event.preventDefault();
    setMessagesError(false);

    if(inputMessage == '') {
      setMessagesError(true);
      setNotify({
        isOpen: true,
        message: "メッセージは必須です。",
        type: 'error'
      });
    }

    try{
      const response = await api.post('/messages', {
        content: inputMessage,
        roomId,
      });
      setMessages((prevMessage) => [...prevMessage, response.data.message]);
    }catch (error) {
      setNotify({
        isOpen: true,
        message: `${error}`,
        type: 'error'
      });
    }

    setInputMessage('');
  }

  useEffect(() => {
    if(!router.isReady) return;

    api.get('/account').then(response => {
      setCurrentUser(response.data.user);
    }).catch(() => {
      router.push('/account/login');
    })

    const intersectionObserver = new IntersectionObserver(async entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        await getPostsList();
      }
    });
    intersectionObserver.observe(document.querySelector('#scroll'));
    return () => intersectionObserver.disconnect();
  }, [router.isReady,cursor]);

  useEffect(() => {
    scrollToBottom()
  })

  return (
    <>
      <Header />
      <Container maxWidth='sm' className={classes.container}>
        <div className={classes.messagesBody}>
          <div id="scroll"></div>
          {messages.map((message: Messages) => (
            (message.user.id == currentUser.id)
            ? <MessageRight
                user={message.user}
                content={message.content}
                createdAt={message.createdAt}
              />
            : <MessageLeft
              key={message.id}
              user={message.user}
              content={message.content}
              createdAt={message.createdAt}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <TextField
            className={classes.textField}
            variant="outlined"
            multiline
            fullWidth
            onChange={handleChange}
            value={inputMessage}
            error={messagesError}
          />
          <Box mt={1} >
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              disabled={inputValue}
              color="secondary"
            >
              メッセージを送信
            </Button>
          </Box>
        </form>
      </Container>

      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
      <BottomHeaderNavigation />
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
