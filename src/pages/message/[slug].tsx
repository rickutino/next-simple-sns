import { useRouter } from 'next/router'
import { FormEvent, useContext, useEffect, useState } from 'react';

import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';

import Header from '../../components/Header';
import { makeStyles } from '@mui/styles';
import { Avatar, Button, Card, CardHeader, Grid, TextField, Theme } from '@mui/material';

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
  roomId: string;
  post: Posts;
  postId: number;
  user: User;
  userId: number;
  content: string;
  createdAt: Date;
}

const useStyles = makeStyles((theme: Theme) =>({
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
  const [ inputMessage, setInputMessage] = useState('')
  const [ messages, setMessages ] = useState<Messages[]>([]);
  const [ inputValue, setInputValue ] = useState(true);
  const [ messagesError, setMessagesError ] = useState(false);
  const classes = useStyles();
	const router = useRouter();
  const roomId = router.query.slug;

  useEffect(() => {
    if(!router.isReady) return;

    api.get(`/messages?roomId=${roomId}`).then(response => {
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
  }

  return (
    <>
      <Header />
      <Grid>
        {console.log(messages)}
        {messages.map((message) => {
          <>
            <li key={message.id}>
              <span>name: {message.user.name}</span>{" "}
              <span>age: {message.createdAt}</span>
            </li>
          </>
        })}
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <TextField
            className={classes.textField}
            variant="outlined"
            multiline
            fullWidth
            onChange={e => handleChange(e)}
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
