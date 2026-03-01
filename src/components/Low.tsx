import React from 'react'
import { Modal } from '../components/ui/Modal'
import { PrintIcon } from '../components/ui/Icons'
// @ts-ignore
import { Caducidad } from '../tools/pdf/Caducidad';

const Low = ({ show, handleClose, mincad }: any) => {

    const items: any[] = [];
    mincad.forEach((item: any, index: number) => {
        items.push([index, item.Codigo, item.Saldo, item.Costo_Unitario_Neto, (item.Saldo * item.Costo_Unitario_Neto).toFixed(2), item.Caducidad]);
    })

    const handlePDF = () => {
        Caducidad(items);
    }

    const modalFooter = (
        <div className="d-flex justify-content-end w-100">
            <button className="btn btn-icon border-0 bg-transparent text-secondary p-1" onClick={handlePDF} title="Imprimir Reporte">
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
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered m-0">
                    <thead className="table-light">
                        <tr>
                            <th className="px-3">#</th>
                            <th>Codigo</th>
                            <th>Saldo</th>
                            <th>Costo Unitario</th>
                            <th>Costo Total</th>
                            <th>Fecha de Caducidad</th>
                            <th>Observación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mincad?.map((item: any, index: number) => {
                            const isExpired = new Date(item.Caducidad) < new Date();
                            return (
                                <tr key={index} className="align-middle">
                                    <td className="px-3 fw-medium text-muted">{index + 1}</td>
                                    <td className="fw-semibold text-primary">{item.Codigo}</td>
                                    <td>{item.Saldo}</td>
                                    <td>{item.Costo_Unitario_Neto}</td>
                                    <td>{(item.Saldo * item.Costo_Unitario_Neto).toFixed(2)}</td>
                                    <td className={isExpired ? "text-danger fw-bold" : ""}>{item.Caducidad}</td>
                                    <td>
                                        <span className={`badge ${isExpired ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                            {isExpired ? 'Ya caducado' : 'Próximo a caducar'}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                        {(!mincad || mincad.length === 0) && (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-muted">
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