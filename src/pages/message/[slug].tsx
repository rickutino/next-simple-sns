import { useRouter } from 'next/router'
import { FormEvent, useContext, useEffect, useState } from 'react';

import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';

import Header from '../../components/Header';
import { makeStyles } from '@mui/styles';
import { Button, Grid, TextField, Theme } from '@mui/material';
import { MessageLeft, MessageRight } from '../../components/Message';

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
    width: '650px',
    margin: '0 auto',
    height: '75vh',
    alignItems: "center",
    flexDirection: "column",
    position: "relative"
  },
  messagesBody: {
    width: "calc( 100% - 20px )",
    margin: 10,
    overflowY: "scroll",
    height: "calc( 100% - 80px )"
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
  const [ currentUser, setCurrentUser] = useState<User>()
  const [ messages, setMessages ] = useState<Messages[]>([]);
  const [ inputValue, setInputValue ] = useState(true);
  const [ inputMessage, setInputMessage] = useState('')
  const [ messagesError, setMessagesError ] = useState(false);

  const classes = useStyles();
	const router = useRouter();
  const roomId = router.query.slug;

  useEffect(() => {
    api.get('/account').then(response => {
      setCurrentUser(response.data.user);
    }).catch(() => {
      router.push('/account/login');
    })
  }, []);

  useEffect(() => {
    if(!router.isReady) return;

    api.get(`/messages?pagination[order]=ASC&roomId=${roomId}`).then(response => {
      setMessages(response.data.messages);
    }).catch((error) => {
      console.log(error);
    })
  } ,[router.isReady]);

  function handleChange ( e ) {
    setInputMessage(e.target.value);
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

  return (
    <>
      <Header />
      <Grid className={classes.container}>
        <div className={classes.messagesBody}>
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
        </div>
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <TextField
            className={classes.textField}
            variant="outlined"
            multiline
            fullWidth
            onChange={e => handleChange(e)}
            value={inputMessage}
            error={messagesError}
          />
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            disabled={inputValue}
            color="secondary"
          >
            メッセージを送信
          </Button>
        </form>
      </Grid>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  );
}
