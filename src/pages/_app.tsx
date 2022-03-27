import {
  StylesProvider,
  ThemeProvider as MaterialThemeProvider
} from '@mui/styles';
import { ToastProvider } from 'react-toast-notifications';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/styles.css';
import theme from '../styles/theme';

export default function MyApp({ Component, pageProps }) {
  return (
    <StylesProvider injectFirst>
      <MaterialThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <ToastProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </ToastProvider>
        </StyledThemeProvider>
      </MaterialThemeProvider>
    </StylesProvider>
  );
}
