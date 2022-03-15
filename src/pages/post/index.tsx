import { Box, Button, Container, TextField, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";

import { Header, BottomHeaderNavigation } from "../../components/Header";

import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/AuthContext";
import { parseCookies } from 'nookies';
import { api } from "../../services/api";

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    width: '80%',
    margin: "36px auto 0",
  },
  textField: {
    borderRadius: '5px',
    backgroundColor: theme.palette.grey[200],
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
  const [ countLength, setCountLength ] = useState<Number>(0);
  const [ sendButtonDisabled, setSendButtonDisabled ] = useState(true);
  const [ inputError, setInputError ] = useState(false);

  const router = useRouter();
  const classes = useStyles();

  function handleChange ( event: React.ChangeEvent<HTMLInputElement> ) {
    setCountLength(event.target.value.length);
    setPost(event.target.value);
    setSendButtonDisabled(false);
  }

  async function handleSubmit ( event: FormEvent) {
    event.preventDefault();
    setInputError(false);

    if(post == '') {
      setInputError(true);
      setNotify({
        isOpen: true,
        message: "コメントは必須です。",
        type: 'error'
      });

      return;
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
          <Typography variant="body1" align="right" >{countLength}</Typography>
          <TextField
            className={classes.textField}
            variant="outlined"
            multiline
            fullWidth
            rows={3}
            onChange={handleChange}
            inputProps={{ maxLength: 140 }}
            error={inputError || post.length == 140 ? true : false}
          />
          <Box mt={3}>
            <Button
              sx={{
                borderRadius: '50px',
                height: '55px',
                width: '100%',
                marginTop: '1.25rem',
              }}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['next-simple-sns']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
