/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { AiFillPlusCircle, AiOutlineMail } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { BottomHeaderNavigation, Header } from '../../components/Header';
import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { User } from '../../shared/interfaces/user.interface';
import theme from '../../styles/theme';

const Root = styled(Box)({
  backgroundColor: theme.palette.primary.main,
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(13)
  }
});

const UpdateProfile = styled(Container)({
  paddingTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '& > *': {
    margin: theme.spacing(1)
  },
  '& span svg': {
    fontSize: '3.5rem',
    position: 'absolute',
    right: '-10.8rem',
    top: '-3.6rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '3.3rem',
      right: '-7.2rem',
      top: '-3.3rem'
    }
  }
});

const Input = styled('input')({
  display: 'none'
});

const ProfileAvatar = styled(Avatar)({
  margin: '0 auto',
  width: '185px',
  height: '185px',
  [theme.breakpoints.down('md')]: {
    width: '125px',
    height: '125px'
  }
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '& h6': {
    color: theme.palette.grey[400]
  },
  '& h6 div': {
    borderRadius: '5px',
    background: theme.palette.grey[300],
    color: theme.palette.grey[400]
  },
  '& div button': {
    borderRadius: '50px',
    height: '3.5rem',
    width: '100%',
    marginTop: theme.spacing(7),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(6)
    }
  }
});

const ProfileInput = styled(TextField)({
  borderRadius: '5px',
  background: theme.palette.grey[300],
  color: theme.palette.grey[400]
});

export default function Update() {
  const [currentUser, setCurrentUser] = useState<User>();
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [inputValue, setInputValue] = useState(true);
  const [nameInputError, setNameInputError] = useState(false);
  const [emailInputError, setEmailInputError] = useState(false);

  const { notify, setNotify } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    api.get('/account').then(response => {
      setCurrentUser(response.data.user);
      setNameInput(response.data.user.name);
      setEmailInput(response.data.user.email);
    });
  }, []);

  async function changeUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const imageFile = event.target.files[0];

    const formData = new FormData();
    formData.append('file', imageFile);

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };

    await api
      .patch('/account/icon_image', formData, config)
      .then(response => {
        const uploadUserIcon = {
          ...currentUser,
          iconImageUrl: response.data.user.iconImageUrl
        };

        setCurrentUser(uploadUserIcon);

        setNotify({
          isOpen: true,
          message: 'プロフィールアイコンを変更しました。',
          type: 'success'
        });
      })
      .catch(error => {
        setNotify({
          isOpen: true,
          message: `プロフィール変更にエラーが発生しました: ${error}`,
          type: 'error'
        });
      });
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  }

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (nameInput === '') {
      setNameInputError(true);
      setNotify({
        isOpen: true,
        message: '名前は必須です。',
        type: 'error'
      });
    }
    if (emailInput === '') {
      setEmailInputError(true);
      setNotify({
        isOpen: true,
        message: '名前は必須です。',
        type: 'error'
      });
    }

    try {
      await api.patch('/account/profile', {
        name: nameInput,
        email: emailInput
      });

      setNotify({
        isOpen: true,
        message: 'プロフィールを変更しました。',
        type: 'success'
      });

      router.push('/profile');
    } catch (error) {
      setNotify({
        isOpen: true,
        message: `${error}`,
        type: 'error'
      });
    }
  }

  return (
    <Root>
      <Header />
      <UpdateProfile maxWidth="sm">
        <Input
          accept="image/*"
          id="icon-button-file"
          type="file"
          onChange={changeUploadFile}
        />
        <label htmlFor="icon-button-file">
          <ProfileAvatar src={currentUser?.iconImageUrl} />
          <IconButton
            color="secondary"
            aria-label="upload picture"
            component="span"
          >
            <AiFillPlusCircle />
          </IconButton>
        </label>
        <Form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Typography variant="h6">Name</Typography>
            <ProfileInput
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
                )
              }}
            />
          </Box>

          <Typography variant="h6">Email</Typography>
          <ProfileInput
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
              )
            }}
          />
          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={inputValue}
              color="secondary"
              fullWidth
            >
              更新
            </Button>
          </Box>
        </Form>
        <Notification notify={notify} setNotify={setNotify} />
      </UpdateProfile>

      <BottomHeaderNavigation />
      <Notification notify={notify} setNotify={setNotify} />
    </Root>
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
