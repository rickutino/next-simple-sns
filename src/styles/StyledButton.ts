import { Button, styled } from '@mui/material';
// import styled from 'styled-components';

// import { Button } from '@mui/icons-material';

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.palette.secondary.main};
  border-radius: 5px;
  border: 1px black ;
  color: ${props => props.theme.palette.secondary.main};
  height: 48px;
  weight: 325px;
  margin-top: 1rem;
  padding: 0 30px;
  &&:hover {
    background: ${props => props.theme.palette.secondary.light};
  }
`;

export default StyledButton;
