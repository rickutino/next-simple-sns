import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Grid, Link, styled, Typography } from '@mui/material';
import type { GetServerSideProps, NextPage } from "next";
import Image from 'next/image';
import { parseCookies } from "nookies";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import * as yup from "yup";
import { RHFTextInput } from "../../components/Inputs/RHFTextInput";
import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/AuthContext";
import theme from '../../styles/theme';

interface ISingUpForm {
  name: string;
  email: string;
  password: string;
}

const ContainerRoot = styled(Container)({
  height: '100vh',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.grey[200]
});

const PostButton = styled(Button)({
  borderRadius: '5px',
  border: '1px black' ,
  color: theme.palette.grey[200],
  height: '48px',
  weight: '325px',
  marginTop: '1rem',
  padding: '0 30px',
  '&&:hover': {
    background: theme.palette.secondary.light,
  }
});

const schema = yup.object().shape({
  name: yup
    .string()
    .required("名前は必出です。"),
  email: yup
    .string()
    .email("有効なメールアドレスを入力してください。")
    .required("メールアドレスは必出です。"),
  password: yup
    .string()
    .min(8, "パスワードを8文字以上にいれてください。.")
    .required("パスワードは必出です."),
});

export default function SingUp({}: NextPage) {
  const { singUp, notify, setNotify } = useContext(AuthContext);

  const methods = useForm<ISingUpForm>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSingIn (data: ISingUpForm)  {
    await singUp(data);

    methods.reset();
  };

  return (
    <>
      <ContainerRoot>
        <Grid
          item
          xs={false}
          lg={6.5}
          sx={{
            backgroundImage: 'url(https://user-images.githubusercontent.com/48019175/153536143-2b002027-7d7d-4ed8-b967-5507498aa916.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}/>

        <Grid item xs={12} lg={5.5}>
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              src={`/logo.svg`}
              alt="logo"
              width={200}
              height={200}
            />

            <Typography component="h2" variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
              アカウント登録
            </Typography>


            <Box sx={{ mt: 7 }}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSingIn)}>
                  <RHFTextInput
                    label="name"
                    name="name"
                    type="text"
                    defaultValue="Small"
                    size="small"
                    fullWidth
                  />
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
                  <PostButton
                    color="secondary"
                    variant="contained"
                    fullWidth
                    disabled={!methods.formState.isDirty || !methods.formState.isValid}
                    type="submit"
                  >
                    登録
                  </PostButton>
                </form>
              </FormProvider>
            </Box>

            <Button
              color='secondary'
              href='/account/login'
              component={Link}
              sx={{
                mt: 18,
                '& svg': {
                marginRight: '12px',
                height: '18px',
                width: '18px'
              }
            }}>
              <AiOutlineArrowLeft />
              ログインに戻る
            </Button>
          </Box>
        </Grid>
      </ContainerRoot>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['next-simple-sns']: token } = parseCookies(ctx)

  if (!!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
