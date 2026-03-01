import React from 'react'
import impresora from '../assets/images/impresora.png'
import { Movimientos } from '../tools/pdf/Movimientos'

const Imprimir = ({ items, title }) => {

    const handlePDF = () => {
        Movimientos(items, title)
    }

    return (
        <img
            src={impresora}
            alt="imprimir"
            style={{
                position: 'absolute',
                width: 40,
                top: 65,
                right: 20,
                cursor: 'pointer'
            }}
            onClick={handlePDF}
        />
    )
}

export default Imprimir