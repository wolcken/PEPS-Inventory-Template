import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { ListInventory } from '../utils/ListInventory';
import Scarce from '../components/Scarce';
import impresora from '../assets/images/impresora.png';
import { Inventory } from '../tools/pdf/Inventory';

const Inventario = () => {

    const [show, setShow] = useState(false);

    const inventory = ListInventory();
    const items = [];

    const style3 = {
        background: '#5CDDD0'
    }

    const low = [];
    const [bandera, setBandera] = useState(true);

    inventory.forEach((item) => {
        if (item.saldo <= 50) {
            low.push(item);
        }
    });

    const openModal = () => {
        if (bandera && low.length > 0) {
            setShow(true);
        };
    }

    const handleClose = () => {
        setShow(false);
        setBandera(false);
    }

    useEffect(() => {
        openModal();
    });

    inventory.forEach((item, index) => {
        items.push([index, item.codigo, item.medicamento, item.saldo, item.costo, (item.saldo * item.costo).toFixed(2)])
    })

    const handlePDF = () => {
        Inventory(items)
    }

    return (
        <>
            <div style={{ margin: 10 }}>
                <h3>Inventario</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={style3}>#</th>
                            <th style={style3}>Codigo</th>
                            <th style={style3}>Medicamento</th>
                            <th style={style3}>Saldo Fisico</th>
                            <th style={style3}>Costo Unitario</th>
                            <th style={style3}>Saldo Valorado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item, index) => (
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{item.codigo}</td>
                                <td>{item.medicamento}</td>
                                <td style={{ color: (item.saldo > 50 ? 'green' : 'red') }}>{item.saldo}</td>
                                <td>{item.costo}</td>
                                <td>{(item.saldo * item.costo).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
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
            <Scarce show={show} handleClose={handleClose} low={low} />
        </>
    )
}

export default Inventario