import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react';

import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';

import Header from '../../components/Header';
import { makeStyles } from '@mui/styles';
import { Grid, Theme } from '@mui/material';

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

interface Rooms {
  id: string;
  messages: Messages;
  roomUsers: [
    rooId: string,
    userId: string,
    user: User,
  ]
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

export default function Room() {
  const { notify, setNotify } = useContext(AuthContext);
  const [ rooms, setRooms ] = useState<Rooms[]>([]);
  const classes = useStyles();
	const router = useRouter();

  useEffect(() => {

    api.get('/rooms').then(response => {
      setRooms(response.data.rooms);
    }).catch((error) => {
      console.log(error);
    })
  } ,[]);


  return (
    <>
      <Header />
      <Grid>
        {console.log(rooms)}
        {rooms.map((room ,i) => {
          <>
          console.log(i, room)
            <li key={room.id}>
              <span>name: {room.messages.content}</span>{" "}
              <span>age: {room.roomUsers?.user}</span>
            </li>
          </>
        })}
      </Grid>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  );
}
