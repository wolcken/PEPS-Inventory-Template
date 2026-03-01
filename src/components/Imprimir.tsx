import React from 'react'
import { PrintIcon } from '../components/ui/Icons'
// @ts-ignore
import { Movimientos } from '../tools/pdf/Movimientos'

const Imprimir = ({ items, title }: any) => {

    const handlePDF = () => {
        Movimientos(items, title)
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: 65,
                right: 20,
                cursor: 'pointer',
                color: 'var(--text-secondary)'
            }}
            onClick={handlePDF}
            title="Imprimir"
        >
            <PrintIcon size={40} />
        </div>
    )
}

export default Imprimir