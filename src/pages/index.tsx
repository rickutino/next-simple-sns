import StyledButton from "../components/Button";
import { Button } from '@material-ui/core';

export default function Home() {
  return (
    <>
      <Button variant="contained" color="secondary">Material-UI</Button>
      <StyledButton>Hello World</StyledButton>
    </>
  );
}
