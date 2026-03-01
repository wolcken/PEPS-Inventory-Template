import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import logo from '../assets/images/cute-penguin.gif'

const Inicio = () => {

    const { user } = useContext(AuthContext);

    return (
        <>
            <h3 style={{ marginTop: 50 }}>Primeros en Entrar, Primeros en Salir</h3>
            <img src={logo} alt="logo" />
            <p>{user?.email}</p>
        </>
    )
}

export default Inicio