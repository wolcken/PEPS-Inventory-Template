import React, { useState } from 'react'
import ProveedoresList from '../components/ProveedoresList';
import { Button } from '../components/ui/Button';
// @ts-ignore
import RegisterProviders from '../tools/RegisterProviders';

const Proveedores = () => {

    const [showProvider, setShowProvider] = useState(false);

    const handleCloseProvider = () => setShowProvider(false);
    const handleShowProvider = () => setShowProvider(true);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">Lista de Proveedores</h3>
                <Button variant="primary" onClick={handleShowProvider}>Nuevo Proveedor</Button>
            </div>

            <RegisterProviders
                show={showProvider}
                handleClose={handleCloseProvider}
            />
            <ProveedoresList />
        </div>
    )
}

export default Proveedores