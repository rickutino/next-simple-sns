import { Box, Button, Container, TextField, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";

import Header, { BottomHeaderNavigation } from "../../components/Header";

import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    width: '80%',
    margin: "36px auto 0",
  },
  textField: {
    borderRadius: '5px',
    background: theme.palette.grey[200],
  },
  button: {
    borderRadius: '50px',
    height: '55px',
    width: '100%',
    marginTop: '1.25rem',
  }
}));



export default function Post() {
  const { notify, setNotify } = useContext(AuthContext);
  const [ post, setPost ] = useState('');
  const [ sendButtonDisabled, setSendButtonDisabled ] = useState(true);
  const [ postError, setPostError ] = useState(false);

  const router = useRouter();
  const classes = useStyles();

  function handleChange ( event: React.ChangeEvent<HTMLInputElement> ) {
    setPost(event.target.value);
    setSendButtonDisabled(false);
  }

  async function handleSubmit ( event: FormEvent) {
    event.preventDefault();
    setPostError(false);

    if(post == '') {
      setPostError(true);
      setNotify({
        isOpen: true,
        message: "コメントは必須です。",
        type: 'error'
      });
    }

    setSendButtonDisabled(true);
    try{
      await api.post('/posts', {
        post: {
          body: post,
        }
      });

      setNotify({
        isOpen: true,
        message: "投稿を成功しました。",
        type: 'success'
      });

      router.push('/');
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
      <Container maxWidth='lg'>
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <TextField
            className={classes.textField}
            variant="outlined"
            multiline
            fullWidth
            rows={6}
            onChange={handleChange}
            error={postError}
          />
          <Box mt={3}>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              disabled={sendButtonDisabled}
              color="secondary"
            >
              投稿を送信
            </Button>
          </Box>
        </form>
      </Container>

      <BottomHeaderNavigation />
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  )
}
