import React from 'react'
import { PrintIcon } from '../components/ui/Icons'
// @ts-ignore
import { Movimientos } from '../tools/pdf/Movimientos'

const Imprimir = ({ items, title, headers }: any) => {

    const handlePDF = () => {
        Movimientos(items, title, headers)
    }

    return (
        <div
            className="absolute top-[65px] right-[20px] cursor-pointer text-text-secondary hover:text-primary transition-colors focus:outline-none"
            onClick={handlePDF}
            title="Imprimir"
        >
            <PrintIcon size={40} />
        </div>
    )
}

export default Imprimir