import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import Inicio from '../containers/Inicio';
import Login from '../containers/Login';

const Home = () => {

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogIn = () => {
    setIsLoggedIn(true)
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <Inicio />
        </>
      ) : (
        <>
          <Login onLogIn={handleLogIn} />
        </>
      )}
    </>
  )
}

export default Home