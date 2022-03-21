import "../styles/styles.css";
import theme from "../styles/theme";
import { AuthProvider } from "../contexts/AuthContext";
import {
  ThemeProvider as MaterialThemeProvider,
  StylesProvider
} from "@mui/styles";
import  {
  ThemeProvider as StyledThemeProvider
} from "styled-components";
import { ToastProvider } from "react-toast-notifications";


export default function MyApp({ Component, pageProps }) {
  return (
    <>
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
    </>
  );
}
