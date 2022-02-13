import styled from 'styled-components';

import { Button} from '@mui/material';

const StyledButton = styled(Button)`
  background: ${props => props.theme.palette.secondary.main};
  border-radius: 5px;
  border: 1px black ;
  color: ${props => props.theme.palette.grey[200]};
  height: 48px;
  weight: 325px;
  margin-top: 1rem;
  padding: 0 30px;
  &&:hover {
    background: ${props => props.theme.palette.secondary.light};
  }
`;

export default StyledButton;
