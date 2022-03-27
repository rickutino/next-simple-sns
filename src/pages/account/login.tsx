import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Link, styled, Typography } from '@mui/material';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdOutlineLogin } from 'react-icons/md';
import * as yup from 'yup';
import { RHFTextInput } from '../../components/Inputs/RHFTextInput';
import Notification from '../../components/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import theme from '../../styles/theme';

interface ILoginForm {
  email: string;
  password: string;
}

const LoginButton = styled(Button)({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '5px',
  border: '1px black',
  color: theme.palette.grey[200],
  height: '48px',
  weight: '325px',
  marginTop: '1rem',
  padding: '0 30px',
  '&&:hover': {
    background: theme.palette.secondary.light
  }
});

const Title = styled(Typography)({
  mt: 2,
  fontWeight: 'bold',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(5)
  }
});

const schema = yup.object().shape({
  email: yup
    .string()
    .email('有効なメールアドレスを入力してください。')
    .required('メールアドレスは必出です。'),
  password: yup
    .string()
    .min(8, 'パスワードを8文字以上にいれてください。.')
    .required('パスワードは必出ですa.')
});

export default function Login() {
  const { login, notify, setNotify } = useContext(AuthContext);

  const methods = useForm<ILoginForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function handleSingIn(data: ILoginForm) {
    await login(data);

    methods.reset();
  }

  return (
    <>
      <Grid
        container
        component="main"
        sx={{
          height: '100%',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.grey[200]
        }}
      >
        <Grid item xs={12} lg={5.5}>
          <Box
            sx={{
              my: 13,
              mx: 13,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              [theme.breakpoints.down('sm')]: {
                my: 1,
                mx: 1
              }
            }}
          >
            <Image src="/logo.svg" alt="logo" width={200} height={150} />

            <Title variant="h5">ログイン</Title>

            <Box sx={{ mt: 7 }}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSingIn)}>
                  <RHFTextInput
                    label="Email"
                    name="email"
                    type="text"
                    defaultValue="Small"
                    size="small"
                    fullWidth
                  />
                  <RHFTextInput
                    name="password"
                    label="Password"
                    type="password"
                    defaultValue="Small"
                    size="small"
                    fullWidth
                  />
                  <LoginButton
                    variant="contained"
                    fullWidth
                    disabled={
                      !methods.formState.isDirty || !methods.formState.isValid
                    }
                    type="submit"
                  >
                    ログイン
                  </LoginButton>
                </form>
              </FormProvider>
            </Box>

            <Button
              color="secondary"
              href="/account/singup"
              component={Link}
              sx={{
                mt: 18,
                '& svg': {
                  marginRight: '12px',
                  height: '18px',
                  width: '18px'
                }
              }}
            >
              <MdOutlineLogin />
              新しいアカウントを作成
            </Button>
          </Box>
        </Grid>

        <Grid
          item
          xs={false}
          lg={6.5}
          sx={{
            backgroundImage:
              'url(https://user-images.githubusercontent.com/48019175/151697465-e9dfa806-5404-4142-bf8b-4cdaa8957f74.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { 'next-simple-sns': token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
