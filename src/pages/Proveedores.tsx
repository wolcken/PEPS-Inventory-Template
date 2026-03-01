import React, { useState } from 'react'
import ProveedoresList from '../components/ProveedoresList';
import { Button } from 'react-bootstrap';
// @ts-ignore
import RegisterProviders from '../tools/RegisterProviders';

const Proveedores = () => {

    const [showProvider, setShowProvider] = useState(false);

    const handleCloseProvider = () => setShowProvider(false);
    const handleShowProvider = () => setShowProvider(true);

    return (
        <>
            <Button
                className='mb-3'
                variant="primary"
                onClick={handleShowProvider}
            >Nuevo Proveedor</Button>

            <RegisterProviders
                show={showProvider}
                handleClose={handleCloseProvider}
            />

            <h3>Lista de Proveedores</h3>
            <ProveedoresList />
        </>
    )
}

export default Proveedores