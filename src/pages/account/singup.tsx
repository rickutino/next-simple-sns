import { useContext } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Image from 'next/image';
import Link from 'next/link';

import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import theme from "../../styles/theme";
import StyledButton from "../../styles/StyledButton";
import { RHFTextInput } from "../../components/Inputs/RHFTextInput";
import { Box, Grid, Typography } from '@mui/material';

import { AuthContext } from "../../contexts/AuthContext";
import { parseCookies } from "nookies";
import Notification from "../../components/Notification";

interface ISingUpForm {
  name: string;
  email: string;
  password: string;
}

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
      <Grid container component="main" sx={{ height: '100vh', backgroundColor: theme.palette.primary.main, color: theme.palette.grey[200] }}>

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
                  <StyledButton
                    variant="contained"
                    fullWidth
                    disabled={!methods.formState.isDirty || !methods.formState.isValid}
                    type="submit"
                  >
                    登録
                  </StyledButton>
                </form>
              </FormProvider>
            </Box>

            <Box sx={{ mt: 18 }}>
              <Link href="/account/login">ログインに戻る</Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
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
