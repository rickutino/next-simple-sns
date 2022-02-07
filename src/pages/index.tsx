import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <img src={user?.iconImageUrl} alt="User Image"/>
      <h1>Post: {user?.email}</h1>
    </>
  );
}
