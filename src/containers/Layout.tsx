import React, { useContext } from 'react'
import Header from '../components/Header'
import { AuthContext } from '../context/AuthProvider'

const Layout = ({ children }: any) => {

    const { user } = useContext(AuthContext);

    return (
        <>
            {user !== null ? <Header /> : null}
            {children}
        </>
    )
}

export default Layout