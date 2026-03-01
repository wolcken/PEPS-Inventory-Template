import React from 'react'
import { Modal, Table } from 'react-bootstrap'
import impresora from '../assets/images/impresora.png'
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

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Lista de Unidades Bajas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Codigo</th>
                            <th>Medicamento</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {low?.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{item.codigo}</td>
                                <td>{item.medicamento}</td>
                                <td>{item.saldo}</td>
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

export default Scarce