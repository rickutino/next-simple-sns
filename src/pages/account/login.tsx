import { Box, Button, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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

const Login: NextPage = () => {
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
    <Stack
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#2b2a33",
      }}
    >
      <Box>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack
              spacing={2}
              sx={{
                p: 4,
                width: "300px",
                borderRadius: 1,
                background: "#edede9",
              }}
            >
              <Typography variant="h4" textAlign="center">
                Login RHF
              </Typography>
              <RHFTextInput name="email" label="Email" type="text" />
              <RHFTextInput name="password" label="Senha" type="password" />
              <Button variant="contained" type="submit">
                Enviar
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </Box>
    </Stack>
  );
};

export default Login;