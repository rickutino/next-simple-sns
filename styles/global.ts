import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --input-background: #F0F0F0;

    --primary-color: #5636D3;
    --primary-color-dark: #3c2593;
    --primary-color-light: #775edb;

    --second-color: #FF872C;
    --second-color-dark: #B25E1E;
    --second-color-light: #FF9F56;

    --success-color: #4CAF50;
    --error-color: #F44336;

    --gray-200: #EEEEEE;
    --gray-400: #BDBDBD;
    --gray-500: #9E9E9E;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    @media (max-width: 1080px) {
      font-size: 93.75%; // 15px
    }
    @media (max-width: 720px) {
      font-size: 87.5%; // 14px
    }
  }

  body {
    background: var(--background);
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button {
    font-family: 'Pippins', sans-serif;
    font-weight: 400;
  }

  h1, h2, h3, h4, h5, h6, strong{
    font-weight: 600;
  }

  button {
    cursor: pointer;
  }
`
