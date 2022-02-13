import type { GetServerSideProps, NextPage } from "next";
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";

import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box, Grid, Typography } from '@mui/material';

import theme from "../../styles/theme";
import { RHFTextInput } from "../../components/RHFTextInput";
import StyledButton from "../../styles/StyledButton";
import Notification from "../../components/Notification";

interface ILoginForm {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("有効なメールアドレスを入力してください。")
    .required("メールアドレスは必出です。"),
  password: yup
    .string()
    .min(8, "パスワードを8文字以上にいれてください。.")
    .required("パスワードは必出ですa."),
});

export default function Login({}: NextPage) {
  const { login, notify, setNotify } = useContext(AuthContext);

  const methods = useForm<ILoginForm>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSingIn (data: ILoginForm)  {
    await login(data);

    methods.reset();
  };

  return (
    <>
      <Grid container component="main" sx={{ height: '100vh', backgroundColor: theme.palette.primary.main, color: theme.palette.grey[200] }}>
        <Grid item xs={12} lg={5.5}>
          <Box
            sx={{
              my: 13,
              mx: 13,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image
              src={`/logo.svg`}
              alt="logo"
              width={200}
              height={200}
            />

            <Typography component="h2" variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
              ログイン
            </Typography>


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
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={!methods.formState.isDirty || !methods.formState.isValid}
                    type="submit"
                  >
                    ログイン
                  </StyledButton>
                </form>
              </FormProvider>
            </Box>

            <Box sx={{ mt: 18 }}>
              <Link href="/account/singup">新しいアカウントを作成</Link>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={false}
          lg={6.5}
          sx={{
            backgroundImage: 'url(https://user-images.githubusercontent.com/48019175/151697465-e9dfa806-5404-4142-bf8b-4cdaa8957f74.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}/>

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
