import React, { useEffect, useState } from 'react'
import { ListInventory } from '../utils/ListInventory';
import Scarce from '../components/Scarce';
import { PrintIcon } from '../components/ui/Icons';
// @ts-ignore
import { Inventory } from '../tools/pdf/Inventory';

const Inventario = () => {

    const [show, setShow] = useState(false);

    const inventory = ListInventory();
    const items: any[] = [];

    const style3 = {
        background: '#5CDDD0'
    }

    const low: any[] = [];
    const [bandera, setBandera] = useState(true);

    inventory.forEach((item: any) => {
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

    inventory.forEach((item: any, index: number) => {
        items.push([index, item.codigo, item.medicamento || item.nombre, item.saldo, item.costo, (item.saldo * item.costo).toFixed(2)])
    })

    const handlePDF = () => {
        Inventory(items)
    }

    return (
        <>
            <div style={{ margin: 10 }}>
                <h3>Inventario</h3>
                <div className="table-responsive card mt-3">
                    <table className="table">
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
                            {inventory.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.medicamento || item.nombre}</td>
                                    <td style={{ color: (item.saldo > 50 ? 'green' : 'red') }}>{item.saldo}</td>
                                    <td>{item.costo}</td>
                                    <td>{(item.saldo * item.costo).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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
            <Scarce show={show} handleClose={handleClose} low={low} />
        </>
    )
}

export default Inventario