import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { FormEvent, useContext, useState } from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import theme from '../styles/theme';
import Notification from './Notification';

interface User {
  id?: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

interface Post {
  id?: number;
  body: string;
  createdAt?: string;
  user: User;
}

interface PropsData {
  post: Post;
  currentUser: User;
}

function jaTimeZone(hours: string) {
  const localTime = (date: Date) =>
    date.toLocaleString('ja', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });

  const dateString = hours;
  const localDate = new Date(dateString);

  return localTime(localDate);
}

const PostContainer = styled(Container)({
  marginTop: '4rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const PostCard = styled(Card)({
  width: '100%',
  padding: '1rem 5rem',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.grey[200],
  [theme.breakpoints.down('md')]: {
    padding: '0.5rem 2rem'
  }
});

const PostTime = styled('div')({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.grey[200],
  '& svg': {
    color: theme.palette.secondary.main,
    marginRight: '0.4rem',
    height: '16px',
    width: '16px'
  }
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    margin: '0 1rem'
  },
  '& > div': {
    borderRadius: '5px',
    backgroundColor: theme.palette.grey[200]
  },
  '& button': {
    borderRadius: '5px',
    height: '3.5rem',
    width: '16rem',
    color: theme.palette.grey[800]
  }
});

export default function Post({ post, currentUser }: PropsData) {
  const { notify, setNotify } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [inputValue, setInputValue] = useState(true);
  const [commentError, setCommentError] = useState(false);

  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setComment(event.target.value);
    setInputValue(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setCommentError(false);

    if (comment === '') {
      setCommentError(true);
      setNotify({
        isOpen: true,
        message: 'コメントは必須です。',
        type: 'error'
      });
    }

    try {
      const response = await api.post('/messages/via_post', {
        content: comment,
        postId: post.id
      });
      const { roomId } = response.data.message;
      router.push(`/message/${roomId}`);
    } catch (error) {
      setNotify({
        isOpen: true,
        message: `${error}`,
        type: 'error'
      });
    }
  }

  return (
    <PostContainer key={post.id} maxWidth="md">
      <PostCard>
        <CardHeader
          avatar={
            <Avatar
              src={post.user?.iconImageUrl}
              sx={{ height: '56px', width: '56px' }}
            />
          }
          title={<Typography variant="h5">{post.user?.name}</Typography>}
          subheader={
            <PostTime>
              <BiTimeFive />
              <Typography>{jaTimeZone(post.createdAt)}</Typography>
            </PostTime>
          }
        />
        <CardContent
          sx={{
            flex: 1,
            color: theme.palette.grey[200]
          }}
        >
          <Typography
            sx={{
              overflowWrap: 'break-word',
              whiteSpace: 'break-spaces'
            }}
            variant="body1"
          >
            {post.body}
          </Typography>
        </CardContent>
      </PostCard>
      {post.user.id !== currentUser?.id && (
        <Form onSubmit={e => handleSubmit(e)}>
          <TextField
            id={String(post.id)}
            variant="outlined"
            multiline
            fullWidth
            onChange={handleChange}
            error={commentError}
          />
          <Button
            id={String(post.id)}
            type="submit"
            variant="contained"
            disabled={inputValue}
            color="secondary"
          >
            DMを送信
          </Button>
        </Form>
      )}
      <Notification notify={notify} setNotify={setNotify} />
    </PostContainer>
  );
}
