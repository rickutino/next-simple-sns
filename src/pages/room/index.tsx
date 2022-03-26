/* eslint-disable no-unused-expressions */
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Avatar,
  ButtonBase,
  Card,
  CardHeader,
  Container,
  Grid,
  Theme,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext, useEffect, useState } from 'react';
import { BottomHeaderNavigation, Header } from '../../components/Header';
import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

interface Posts {
  id?: number;
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

interface Rooms {
  id: string;
  messages: Messages;
  roomUsers: {
    user: User;
    rooId: string;
    userId: string;
  };
}

function jaTimeZone(hours: string) {
  const dateToTime = (date: Date) =>
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2rem auto'
  },
  card: {
    width: '100%',
    padding: '1.5rem 6rem 1.5rem 1.5rem'
  },
  subText: {
    color: theme.palette.grey[400]
  },
  action: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    borderRadius: '50px',
    height: '3.5rem',
    width: '100%'
  }
}));

// eslint-disable-next-line consistent-return
function getUserFriendIndex(room, currentUser: User) {
  console.log(room);
  if (room.roomUsers[0].user.id !== currentUser.id) {
    return 0;
  }
  if (room.roomUsers[1].user.id !== currentUser.id) {
    return 1;
  }
}

export default function Room() {
  const { notify, setNotify, user } = useContext(AuthContext);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const classes = useStyles();

  useEffect(() => {
    api
      .get('/rooms')
      .then(response => {
        setRooms(response.data.rooms);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="md">
        {rooms.map(room => (
          <Grid key={room.id} className={classes.root}>
            <ButtonBase
              sx={{ width: '100%' }}
              href={`/message/${room.messages[0]?.roomId}`}
            >
              <Card
                sx={{
                  backgroundColor: theme => theme.palette.primary.light,
                  color: theme => theme.palette.grey[200]
                }}
                className={classes.card}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      alt={
                        room.messages[getUserFriendIndex(room, user)]?.user.name
                      }
                      sx={{ width: 56, height: 56 }}
                      src={
                        room.messages[getUserFriendIndex(room, user)]?.user
                          .iconImageUrl
                      }
                    />
                  }
                  action={
                    <div className={classes.action}>
                      <AccessTimeIcon color="secondary" />
                      <Typography ml={1} className={classes.subText}>
                        {jaTimeZone(room.messages[0]?.createdAt)}
                      </Typography>
                    </div>
                  }
                  title={
                    <Typography variant="h6">
                      {
                        room.roomUsers[getUserFriendIndex(room, user)]?.user
                          .name
                      }
                    </Typography>
                  }
                  subheader={
                    <Typography className={classes.subText}>
                      {room.messages[0]?.content}
                    </Typography>
                  }
                />
              </Card>
            </ButtonBase>
          </Grid>
        ))}
      </Container>

      <BottomHeaderNavigation />
      <Notification notify={notify} setNotify={setNotify} />
    </>
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
