import React, { useState } from 'react'
import { Button } from '../components/ui/Button'
// @ts-ignore
import RegisterInsumos from '../tools/RegisterInsumos';
import InsumoList from '../components/InsumoList';

const Insumos = () => {

    const [showRegister, setShowRegister] = useState(false);

    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);

    return (
        <div className="container mx-auto px-4 mt-6">
            <div className="flex justify-between items-center mb-6 mt-2">
                <h3 className="m-0 text-2xl font-semibold text-text-primary">Lista de Insumos</h3>
                <Button variant="primary" onClick={handleShowRegister}>Nuevo Insumo</Button>
            </div>

            <RegisterInsumos
                show={showRegister}
                handleClose={handleCloseRegister}
            />
            <InsumoList />
        </div>
    )
}

export default Insumos