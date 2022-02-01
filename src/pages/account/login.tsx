import type { NextPage } from "next";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from 'next/image';
import Link from 'next/link';

import { Box, Grid, Typography } from '@mui/material';

import StyledButton from '../../components/StyledButton';
import theme from "../../styles/theme";
import { RHFTextInput } from "../../components/RHFTextInput";


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
  const methods = useForm<ILoginForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: ILoginForm) => {
    console.log(data);
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

            <Typography component="h2" variant="h5" sx={{ fontWeight: 'bold' }}>
              ログイン
            </Typography>


            <Box sx={{ mt: 7 }}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <RHFTextInput
                    label="Email"
                    name="email"
                    type="text"
                  />
                  <RHFTextInput
                    name="password"
                    label="Password"
                    type="password"
                  />
                  <StyledButton
                    variant="contained"
                    fullWidth
                    type="submit"
                  >
                    ログイン
                  </StyledButton>
                  <Link href="#">Link</Link>
                </form>
              </FormProvider>
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
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}/>

      </Grid>
    </>
  );
}
