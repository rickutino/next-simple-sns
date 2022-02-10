import type { NextPage } from "next";
import Image from 'next/image';
import Link from 'next/link';
import { useForm, FormProvider } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box, Grid, Typography } from '@mui/material';

import theme from "../../styles/theme";
import StyledButton from '../../components/StyledButton';
import { RHFTextInput } from "../../components/RHFTextInput";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

interface ISingUpForm {
  name: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .email("名前を入力してください。")
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
  const methods = useForm<ISingUpForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSingIn (data: ISingUpForm)  {
    const { singUp } = useContext(AuthContext);
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
            backgroundImage: 'url(SingUp.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}/>

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
    </>
  );
}