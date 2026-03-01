import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
// @ts-ignore
import RegisterInsumos from '../tools/RegisterInsumos';
import InsumoList from '../components/InsumoList';

const Insumos = () => {

    const [showRegister, setShowRegister] = useState(false);

    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);

    return (
        <>
            <Button
                className='mb-3'
                variant="primary"
                onClick={handleShowRegister}
            >Nuevo Insumo</Button>

            <RegisterInsumos
                show={showRegister}
                handleClose={handleCloseRegister}
            />

            <h3>Lista de Insumos</h3>
            <InsumoList />
        </>
    )
}

export default Insumos