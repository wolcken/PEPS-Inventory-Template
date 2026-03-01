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
            title="Lista de Unidades Bajas"
            footer={modalFooter}
        >
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered m-0">
                    <thead className="table-light">
                        <tr>
                            <th className="px-3">#</th>
                            <th>Codigo</th>
                            <th>Nombre</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {low?.map((item: any, index: number) => (
                            <tr key={index} className="align-middle">
                                <td className="px-3 fw-medium text-muted">{index + 1}</td>
                                <td className="fw-semibold text-primary">{item.codigo}</td>
                                <td className="fw-semibold">{item.medicamento}</td>
                                <td>
                                    <span className="badge bg-danger">
                                        {item.saldo}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!low || low.length === 0) && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-muted">
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