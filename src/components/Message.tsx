/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import { Avatar, Box, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

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
  createdAt?: Date;
}

const useStyles = makeStyles((theme: Theme) => ({
  messageRow: {
    display: 'flex'
  },
  messageRowRight: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  postContext: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.grey[200],
    margin: '0 auto',
    width: '100%',
    maxWidth: '250px',
    borderRadius: '5px',
    height: '3.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  friendMessage: {
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
  },
  myMessage: {
    position: 'relative',
    marginRight: '2.5rem',
    marginBottom: '1.25rem',
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
      top: '0',
      right: '-15px'
    }
  },
  messageContent: {
    padding: 0,
    margin: 0,
    width: '300px'
  },
  messageTimeStampRight: {
    position: 'absolute',
    fontSize: '.85em',
    fontWeight: '300',
    marginTop: '10px',
    bottom: '-3px',
    right: '5px'
  },
  avatarNothing: {
    color: 'transparent',
    backgroundColor: 'transparent',
    width: theme.spacing(4),
    height: theme.spacing(4)
  },
  displayName: {
    marginLeft: '20px'
  }
}));
function jaTimeZone(hours) {
  const dateToTime = date =>
    date.toLocaleString('ja', {
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

export function PostContext({ post }: Messages) {
  const classes = useStyles();
  return (
    !!post && (
      <div className={classes.postContext}>
        <Typography variant="subtitle2">投稿に返信しました</Typography>
        <Typography variant="body1">{post?.body}</Typography>
      </div>
    )
  );
}

export function MessageLeft({ user, content, createdAt }: Messages) {
  const classes = useStyles();

  return (
    <div className={classes.messageRow}>
      <Avatar
        alt={user?.name}
        src={user?.iconImageUrl ? user.iconImageUrl : `/icons/profileIcon.png`}
      />
      <Box sx={{ width: '90%' }}>
        <div className={classes.displayName}>{user?.name}</div>
        <div className={classes.friendMessage}>
          <p className={classes.messageContent}>{content}</p>
          <div className={classes.messageTimeStampRight}>
            {jaTimeZone(createdAt)}
          </div>
        </div>
      </Box>
    </div>
  );
}

export function MessageRight({ content, createdAt }: Messages) {
  const classes = useStyles();

  return (
    <div className={classes.messageRowRight}>
      <div className={classes.myMessage}>
        <p className={classes.messageContent}>{content}</p>
        <div className={classes.messageTimeStampRight}>
          {jaTimeZone(createdAt)}
        </div>
      </div>
    </div>
  );
}
