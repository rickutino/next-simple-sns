import styled from 'styled-components';

export const Container = styled.header`
  padding: 32px 0;
  background:  ${props => props.theme.palette.primary.main};
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto 56px;
  display: flex;
  align-items: center;
  > img {
    height: 42px;
  }
  nav {
    margin-left: auto;
    display: flex;
    height: 100%;
    width: 265px;
    align-items: center;
    justify-content: space-between;
    svg {
      color: ${props => props.theme.palette.grey[200]};
      width: 24px;
      height: 24px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    button.logout {
      background: transparent;
      border: 0;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 48px;
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  line-height: 24px;
  span {
    color: #999591;
  }
  strong {
    color: ${props => props.theme.palette.secondary.main};
  }
  a {
    text-decoration: none;
    &:hover {
      opacity: 0.8;
    }
  }
`;
