import React from 'react'
import { Modal, Table } from 'react-bootstrap'
import impresora from '../assets/images/impresora.png'
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

    return (
        <Modal show={show} onHide={handleClose} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Lista de Caducidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Codigo</th>
                            <th>Saldo</th>
                            <th>Costo Unitario</th>
                            <th>Costo Total</th>
                            <th>Fecha de Caducidad</th>
                            <th>Observación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mincad?.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{item.Codigo}</td>
                                <td>{item.Saldo}</td>
                                <td>{item.Costo_Unitario_Neto}</td>
                                <td>{(item.Saldo * item.Costo_Unitario_Neto).toFixed(2)}</td>
                                <td>{item.Caducidad}</td>
                                <td>{new Date(item.Caducidad) < new Date() ? 'Ya caducado' : 'Próximo a caducar'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <img
                    src={impresora}
                    alt="imprimir"
                    style={{
                        width: 40,
                        cursor: 'pointer'
                    }}
                    onClick={handlePDF}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default Low