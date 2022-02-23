import { Button, TextField, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";
import Header from "../../components/Header";
import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    width: '80%',
    margin: "0 auto"
  },
  textField: {
    borderRadius: '5px',
    background: theme.palette.grey[200],
  },
  button: {
    borderRadius: '50px',
    height: '3.5rem',
    width: '100%',
  }
}));



export default function Post() {
  const { notify, setNotify } = useContext(AuthContext);
  const [ post, setPost ] = useState('');
  const [ inputValue, setInputValue ] = useState(true);
  const [ postError, setPostError ] = useState(false);

  const router = useRouter();
  const classes = useStyles();

  function handleChange ( event ) {
    setPost(event.target.value);
    setInputValue(false);
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

    try{
      await api.post('/posts', {
        post: {
          body: post,
        }
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
      <form className={classes.form} onSubmit={e => handleSubmit(e)}>
        <TextField
          className={classes.textField}
          variant="outlined"
          multiline
          fullWidth
          rows={6}
          onChange={e => handleChange(e)}
          error={postError}
        />
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          disabled={inputValue}
          color="secondary"
        >
          投稿を送信
        </Button>
      </form>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  )
}
