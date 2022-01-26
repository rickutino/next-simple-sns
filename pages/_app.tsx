import '../styles/styles.css';

import theme from "../styles/theme";
import {
  ThemeProvider as MaterialThemeProvider,
  StylesProvider
} from "@material-ui/styles";
import styled, {
  ThemeProvider as StyledThemeProvider
} from "styled-components";


export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <StylesProvider injectFirst>
        <MaterialThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <Component {...pageProps} />
          </StyledThemeProvider>
        </MaterialThemeProvider>
      </StylesProvider>
    </>
  );
}
