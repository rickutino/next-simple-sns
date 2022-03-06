import { Avatar, Box, Button, Container, IconButton, InputAdornment, TextField, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AiFillPlusCircle, AiOutlineMail } from 'react-icons/ai'
import { FiUser } from 'react-icons/fi'
import Header from "../../components/Header";
import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

interface User {
  name: string;
  email: string;
  iconImageUrl?: string | null
}


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  avatar: {
    margin: '0 auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  textField: {
    borderRadius: '5px',
    background: theme.palette.grey[300],
    color: theme.palette.grey[400]
  },
  text: {
    color: theme.palette.grey[400]
  },
  button: {
    borderRadius: '50px',
    height: '3.5rem',
    width: '16rem',
  },
  icon: {
    position: 'absolute',
    right: "-54%",
    top: "-4rem",
  },
  iconButton: {
    position: 'relative',
    top: '600px',
    right: '-1200px',
  },
}))



export default function Update(){
  const [currentUser, setCurrentUser] = useState<User>();
  const [postFileData, setPostFileData] = useState({});
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [inputValue, setInputValue] = useState(true);
  const [nameInputError, setNameInputError] = useState(false);
  const [emailInputError, setEmailInputError] = useState(false);

  const { notify, setNotify } = useContext(AuthContext);
  const classes = useStyles();

  useEffect(() => {
    api.get('/account').then(response => {
      setCurrentUser(response.data.user);
    })
  },[]);

  async function changeUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const imageFile = event.target.files[0];

    const formData = new FormData();
    formData.append("file", imageFile);

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    }

    await api.patch('/account/icon_image', formData, config).then(response =>{
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
    event.target.value = '';
  };

  async function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNameInput(event.target.value);
    setNameInputError(false);
    setInputValue(false);
  }

  async function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmailInput(event.target.value);
    setEmailInputError(false);
    setInputValue(false);
  }

  async function handleSubmit ( event: FormEvent ) {
    event.preventDefault();

    if(nameInput == '') {
      setNameInputError(true);
      setNotify({
        isOpen: true,
        message: "名前は必須です。",
        type: 'error'
      });
    }
    if(emailInput == '') {
      setEmailInputError(true);
      setNotify({
        isOpen: true,
        message: "名前は必須です。",
        type: 'error'
      });
    }

    try{
      await api.post('/account/profile', {
        name: nameInput,
        email: emailInput
      });
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
      <Container maxWidth="sm" className={classes.root}>
        <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={changeUploadFile} />
        <label htmlFor="icon-button-file" >
          <Avatar
            sx={{ width: 185, height: 185 }}
            src={currentUser?.iconImageUrl}
            className={classes?.avatar}
          />
          <IconButton
            sx={{ fontSize: '3.5rem' }}
            color="secondary"
            aria-label="upload picture"
            component="span"
            className={classes.icon}
          >
            <AiFillPlusCircle />
          </IconButton>
        </label>
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <Box mb={2}>
            <Typography variant="h6" className={classes.text} >Name</Typography>
            <TextField
              className={classes.textField}
              variant="outlined"
              multiline
              fullWidth
              onChange={handleNameChange}
              error={nameInputError}
              defaultValue={currentUser?.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiUser />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography variant="h6" className={classes.text} >Email</Typography>
          <TextField
            className={classes.textField}
            variant="outlined"
            multiline
            fullWidth
            onChange={handleEmailChange}
            error={emailInputError}
            defaultValue={currentUser?.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AiOutlineMail />
                </InputAdornment>
              ),
            }}
          />
          <Box mt={3}>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              disabled={inputValue}
              color="secondary"
              fullWidth
            >
              更新
            </Button>
          </Box>
        </form>
        <Notification
          notify={notify}
          setNotify={setNotify}
        />
      </Container>
    </>
  )
}
