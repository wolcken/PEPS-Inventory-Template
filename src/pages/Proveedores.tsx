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
        <div className="container mx-auto px-4 mt-6">
            <div className="flex justify-between items-center mb-6 mt-2">
                <h3 className="m-0 text-2xl font-semibold text-text-primary">Lista de Proveedores</h3>
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