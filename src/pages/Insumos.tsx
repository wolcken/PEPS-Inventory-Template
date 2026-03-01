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
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">Lista de Insumos</h3>
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