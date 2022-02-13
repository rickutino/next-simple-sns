import styled from 'styled-components';
import { TextField } from '@mui/material';


const StyledInput = styled(TextField)`
  background: white;
  & label.MuiFormLabel-root {
    padding-left: 2rem;
    margin-top: 0px;
  }
  border-radius: 5px;
  border: 0;
  outline: 0;
  color: ${props => props.theme.palette.grey[800]};
  height: 48px;
  width: 325px;
  padding: 0 auto;
  &&:nth-child(2) {
    margin-top: 0.5rem;
  }
  &&:nth-child(3) {
    margin-top: 0.5rem;
  }
`;

export default StyledInput;
