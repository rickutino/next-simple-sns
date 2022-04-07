/* eslint-disable no-unused-expressions */
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Avatar,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  styled,
  Typography
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext, useEffect, useState } from 'react';
import { BottomHeaderNavigation, Header } from '../../components/Header';
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
interface AxiosResponseData {
  rooms: Rooms[];
}

function jaTimeZone(hours: string) {
  const dateToTime = (date: Date) =>
    date.toLocaleString('ja', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });

  const dateString = hours;
  const localDate = new Date(dateString);

  return dateToTime(localDate);
}

const RoomRoot = styled(Container)({
  backgroundColor: theme.palette.primary.main,
  width: '100%',
  maxWidth: '2300px',
  padding: '0',
  [theme.breakpoints.down('md')]: {
    paddingTop: '8rem'
  }
});

const RoomGrid = styled(Grid)({
  margin: '2rem 0',
  [theme.breakpoints.down('md')]: {
    margin: '1.2rem 0'
  },
  '& > a': {
    width: '100%',
    '& > div': {
      width: '100%',
      padding: '1.5rem',
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.grey[200],
      [theme.breakpoints.down('md')]: {
        padding: '1.5rem'
      }
    }
  }
});

const RoomAvatar = styled(Avatar)({
  width: '56',
  height: '56'
});

const RoomAction = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& svg': {
    width: '1.1rem',
    height: '1.1rem'
  }
});

const RoomSubtitle = styled(Typography)({
  color: theme.palette.grey[400]
});

function getUserFriendIndex(room: Rooms, currentUser: User) {
  if (room.roomUsers[0].user.id !== currentUser.id) {
    return 0;
  }
  return 1;
}

export default function Room() {
  const { notify, setNotify, user } = useContext(AuthContext);
  const [rooms, setRooms] = useState<Rooms[]>([]);

  useEffect(() => {
    api
      .get<AxiosResponseData>('/rooms')
      .then(response => {
        setRooms(response.data.rooms);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <RoomRoot>
      <Header />
      <Container maxWidth="md">
        {rooms.map(room => (
          <RoomGrid key={room.id}>
            <ButtonBase href={`/message/${room.messages[0]?.roomId}`}>
              <Card>
                <CardHeader
                  sx={{
                    whiteSpace: 'break-spaces',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  avatar={
                    <RoomAvatar
                      alt={
                        room.messages[getUserFriendIndex(room, user)]?.user.name
                      }
                      src={
                        room.messages[getUserFriendIndex(room, user)]?.user
                          .iconImageUrl
                      }
                    />
                  }
                  action={
                    <RoomAction
                      sx={{
                        marginRight: '4rem',
                        display: 'flex',
                        alignItems: 'center',
                        [theme.breakpoints.down('md')]: {
                          marginRight: '0'
                        }
                      }}
                    >
                      <AccessTimeIcon color="secondary" />
                      <RoomSubtitle ml={1}>
                        {jaTimeZone(room.messages[0]?.createdAt)}
                      </RoomSubtitle>
                    </RoomAction>
                  }
                  title={
                    <Typography variant="h6">
                      {
                        room.roomUsers[getUserFriendIndex(room, user)]?.user
                          .name
                      }
                    </Typography>
                  }
                />
                <CardContent>
                  <RoomSubtitle
                    align="left"
                    variant="body1"
                    color="text.secondary"
                  >
                    {room.messages[0]?.content}
                  </RoomSubtitle>
                </CardContent>
              </Card>
            </ButtonBase>
          </RoomGrid>
        ))}
      </Container>

      <BottomHeaderNavigation />
      <Notification notify={notify} setNotify={setNotify} />
    </RoomRoot>
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
