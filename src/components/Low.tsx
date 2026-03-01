import React from 'react'
import { Modal } from '../components/ui/Modal'
import { PrintIcon } from '../components/ui/Icons'
// @ts-ignore
import { Caducidad } from '../tools/pdf/Caducidad';

const Low = ({ show, handleClose, mincad }: any) => {

    const items: any[] = [];
    mincad.forEach((item: any, index: number) => {
        const nombre = item.Nombre || item.Medicamento || '';
        items.push([index, item.Codigo, nombre, item.Saldo, item.Costo_Unitario_Neto, (item.Saldo * item.Costo_Unitario_Neto).toFixed(2), item.Caducidad]);
    })

    const handlePDF = () => {
        Caducidad(items);
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
            size='lg'
            title="Lista de Caducidad"
            footer={modalFooter}
        >
            <div className="w-full overflow-x-auto rounded-lg shadow-[0_0_0_1px_var(--border-color)]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-surface-hover text-text-secondary text-xs uppercase tracking-wider border-b border-border">
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">#</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Codigo</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Nombre</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Saldo</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Costo Unitario</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Costo Total</th>
                            <th className="px-4 py-3 font-semibold border-r border-border last:border-r-0">Fecha de Caducidad</th>
                            <th className="px-4 py-3 font-semibold align-middle">Observación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mincad?.map((item: any, index: number) => {
                            const isExpired = new Date(item.Caducidad) < new Date();
                            return (
                                <tr key={index} className="border-b border-border hover:bg-surface-hover transition-colors">
                                    <td className="px-4 py-3 font-medium text-text-muted border-r border-border last:border-r-0">{index + 1}</td>
                                    <td className="px-4 py-3 font-semibold text-primary border-r border-border last:border-r-0">{item.Codigo}</td>
                                    <td className="px-4 py-3 font-semibold text-text-primary border-r border-border last:border-r-0">{item.Nombre}</td>
                                    <td className="px-4 py-3 text-text-secondary border-r border-border last:border-r-0">{item.Saldo}</td>
                                    <td className="px-4 py-3 text-text-secondary border-r border-border last:border-r-0">{item.Costo_Unitario_Neto}</td>
                                    <td className="px-4 py-3 text-text-secondary border-r border-border last:border-r-0">{(item.Saldo * item.Costo_Unitario_Neto).toFixed(2)}</td>
                                    <td className={`px-4 py-3 border-r border-border last:border-r-0 ${isExpired ? "text-danger font-bold" : "text-text-secondary"}`}>{item.Caducidad}</td>
                                    <td className="px-4 py-3 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isExpired ? 'bg-danger text-white' : 'bg-warning text-text-primary'}`}>
                                            {isExpired ? 'Ya caducado' : 'Próximo a caducar'}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                        {(!mincad || mincad.length === 0) && (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
                                    No hay insumos próximos a caducar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
    )
}

export default Low