import React, { FormEvent, useContext, useState } from 'react';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  Theme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';


import Notification from '../components/Notification';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useRouter } from 'next/router';


interface User {
  id?: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

interface Post {
  id?: number;
  body: string;
  createdAt?: Date;
  user: User
}

interface PropsData {
  post: Post;
  currentUser: User;
}

function jaTimeZone (hours) {
  const dateToTime = date => date.toLocaleString('ja', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  const dateString = hours;
  const localDate = new Date(dateString);

  return dateToTime(localDate);
}


const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  textField: {
    borderRadius: '5px',
    backgroundColor: theme.palette.grey[200],
  },
  button: {
    borderRadius: '50px',
    height: '3.5rem',
    width: '16rem',
  },
}))

export default function Post({ post, currentUser }: PropsData) {
  const { notify, setNotify } = useContext(AuthContext);
  const [ comment, setComment ] = useState('');
  const [ inputValue, setInputValue ] = useState(true);
  const [ commentError, setCommentError ] = useState(false);

  const router = useRouter();
  const classes = useStyles();

  function handleChange ( event: React.ChangeEvent<HTMLInputElement> ) {
    setComment(event.target.value);
    setInputValue(false);
  }

  async function handleSubmit ( event: FormEvent, post: Post) {
    event.preventDefault();
    setCommentError(false);

    if(comment == '') {
      setCommentError(true);
      setNotify({
        isOpen: true,
        message: "コメントは必須です。",
        type: 'error'
      });
    }

    try{
      const response = await api.post('/messages/via_post', {
        content: comment,
        postId: post.id
      });
      const roomId = response.data.message.roomId;
      router.push(`/message/${roomId}`)
    }catch (error) {
      setNotify({
        isOpen: true,
        message: `${error}`,
        type: 'error'
      });
    }
  }

  return(
    <Grid
    key={post.id}
    sx={{
      mx: 'auto',
      mb: 8,
      maxWidth: 735,
    }}
    container
    direction="column"
    justifyContent="center"
    alignItems="center">
    <Card
      sx={{
      width: '100%',
      px: 10,
      py: 2,
      backgroundColor: (theme) => theme.palette.primary.light,
      color: (theme) => theme.palette.grey[200],
    }}>
      <CardHeader
        avatar={
          <Avatar
            src={
              post.user?.iconImageUrl
              ? post.user.iconImageUrl
              : `/icons/profileIcon.png` }
          />
        }
        title={<Typography variant='h6'>{post.user?.name}</Typography>}
        subheader={<Typography>{jaTimeZone(post.createdAt)}</Typography>}
      />
      <CardContent sx={{
        flex: 1,
        color: (theme) => theme.palette.grey[200],
        }}>
        <Typography variant="body1">
          {post.body}
        </Typography>
      </CardContent>
    </Card>
    { post.user.id != currentUser?.id &&
      <form className={classes.form} onSubmit={e => handleSubmit(e , post)}>
        <TextField
          id={String(post.id)}
          className={classes.textField}
          variant="outlined"
          multiline
          fullWidth
          onChange={handleChange}
          error={commentError}
        />
        <Button
          id={String(post.id)}
          className={classes.button}
          type="submit"
          variant="contained"
          disabled={inputValue}
          color="secondary"
        >
          DMを送信
        </Button>
      </form>
    }
    <Notification
      notify={notify}
      setNotify={setNotify}
    />
  </Grid>
  )
}
