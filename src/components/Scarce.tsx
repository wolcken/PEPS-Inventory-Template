import React from 'react'
import { Modal } from '../components/ui/Modal'
import { PrintIcon } from '../components/ui/Icons'
// @ts-ignore
import { Lows } from '../tools/pdf/Lows';

const Scarce = ({ show, handleClose, low }: any) => {

    const items: any[] = [];
    low.forEach((item: any, index: number) => {
        items.push([index, item.codigo, item.medicamento, item.saldo])
    })

    const handlePDF = () => {
        Lows(items)
    }

    const modalFooter = (
        <div className="flex justify-end w-full">
            <button
                className="inline-flex items-center justify-center p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-md transition-colors focus:outline-none"
                onClick={handlePDF}
                title="Imprimir Reporte"
            >
                <PrintIcon size={26} />
            </button>
        </div>
    );

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="xl"
            title="Lista de Unidades Bajas"
            footer={modalFooter}
        >
            <div className="w-full overflow-x-auto rounded-lg shadow-[0_0_0_1px_var(--border-color)]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-surface-hover text-text-secondary text-xs uppercase tracking-wider border-b border-border">
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">#</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Codigo</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Nombre</th>
                            <th className="px-4 py-3 font-semibold align-middle">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {low?.map((item: any, index: number) => (
                            <tr key={index} className="border-b border-border hover:bg-surface-hover transition-colors">
                                <td className="px-4 py-3 font-medium text-text-muted border-r border-border last:border-r-0">{index + 1}</td>
                                <td className="px-4 py-3 font-semibold text-primary border-r border-border last:border-r-0">{item.codigo}</td>
                                <td className="px-4 py-3 font-semibold text-text-primary border-r border-border last:border-r-0">{item.nombre}</td>
                                <td className="px-4 py-3 align-middle">
                                    <span className="inline-flex items-center rounded-full bg-danger px-2.5 py-0.5 text-xs font-semibold text-white">
                                        {item.saldo}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!low || low.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                                    No hay insumos con stock bajo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
    )
}

export default Scarce