/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import { Avatar, Box, styled, Typography } from '@mui/material';
import { BiTimeFive } from 'react-icons/bi';
import theme from '../styles/theme';

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
  id?: number;
  roomId?: string;
  post?: Posts;
  postId?: number;
  user?: User;
  userId?: number;
  content?: string;
  createdAt?: string;
}

const MessageRow = styled(Box)({
  display: 'flex'
});

const MessageRowRight = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end'
});

const PostContent = styled(Box)({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.grey[800],
  margin: '0 auto',
  width: '100%',
  maxWidth: '300px',
  borderRadius: '5px',
  height: '3.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
});

const FriendMessage = styled(Box)({
  position: 'relative',
  marginLeft: '2.5rem',
  marginBottom: '1.25rem',
  padding: '1.25rem 3.75rem',
  backgroundColor: theme.palette.grey[200],
  textAlign: 'left',
  font: "400 .9em 'Open Sans', sans-serif",
  border: `1px solid ${theme.palette.grey[800]}`,
  borderRadius: '5px',
  width: '70%',
  '&:after': {
    content: "''",
    position: 'absolute',
    width: '0',
    height: '0',
    borderTop: `15px solid ${theme.palette.grey[200]}`,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    top: '0',
    left: '-15px'
  }
});

const MyMessage = styled(Box)({
  position: 'relative',
  marginRight: '2.5rem',
  padding: '1.25rem 3.75rem',
  backgroundColor: theme.palette.grey[200],
  width: '70%',
  textAlign: 'left',
  font: "400 .9em 'Open Sans', sans-serif",
  border: `1px solid ${theme.palette.grey[800]}`,
  borderRadius: '5px',
  '&:after': {
    content: "''",
    position: 'absolute',
    width: '0',
    height: '0',
    borderTop: `15px solid ${theme.palette.grey[200]}`,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    top: '-0.5',
    right: '-15px'
  }
});

const MessageContent = styled(Typography)({
  padding: 0,
  margin: 0,
  width: '300px'
});

const FriendName = styled(Box)({
  marginLeft: '20px'
});

const MessageTime = styled('div')({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.grey[200],
  marginRight: theme.spacing(6),
  marginBottom: theme.spacing(3),
  '& svg': {
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(1),
    height: '16px',
    width: '16px'
  }
});

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

export function PostContext({ post }: Messages) {
  return (
    !!post && (
      <PostContent>
        <Typography variant="subtitle2">投稿に返信しました</Typography>
        <Typography variant="body1">{post?.body}</Typography>
      </PostContent>
    )
  );
}

export function MessageLeft({ user, content, createdAt }: Messages) {
  return (
    <MessageRow>
      <Avatar
        alt=""
        src={user?.iconImageUrl ? user.iconImageUrl : `/icons/profileIcon.png`}
      />
      <Box sx={{ width: '90%' }}>
        <FriendName>{user?.name}</FriendName>
        <FriendMessage>
          <MessageContent>{content}</MessageContent>
          <MessageTime>
            <BiTimeFive />
            {jaTimeZone(createdAt)}
          </MessageTime>
        </FriendMessage>
      </Box>
    </MessageRow>
  );
}

export function MessageRight({ content, createdAt }: Messages) {
  return (
    <MessageRowRight>
      <MyMessage>
        <MessageContent>{content}</MessageContent>
      </MyMessage>
      <MessageTime>
        <BiTimeFive />
        {jaTimeZone(createdAt)}
      </MessageTime>
    </MessageRowRight>
  );
}
