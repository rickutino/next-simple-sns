import styled from 'styled-components';

import Button from '@material-ui/core/Button';

const StyledButton = styled(Button)`
  background: ${props => props.theme.palette.primary.main};
  /* background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%); */
  border-radius: 5px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, .3);
  &&:hover {
    background: ${props => props.theme.palette.primary.light};
  }
`;

export default StyledButton;
