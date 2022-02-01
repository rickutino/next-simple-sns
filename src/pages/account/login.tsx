import Image from 'next/image';
import Link from 'next/link';

import { Box, Grid, Typography } from '@mui/material';


import StyledButton from '../../components/StyledButton';
import theme from "../../styles/theme";
import StyledInput from '../../components/StyledInput';

export default function Login() {
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

            <Box component="form" noValidate  sx={{ mt: 7 }}> {/* onSubmit={} */}
              <StyledInput
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <StyledInput
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
              >
                ログイン
              </StyledButton>
              <Link href="#">Link</Link>
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
