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
        items.push([index, item.codigo, item.nombre, item.saldo, item.costo, (item.saldo * item.costo).toFixed(2)])
    })

    const handlePDF = () => {
        Inventory(items)
    }

    return (
        <div className="container mx-auto px-4 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="m-0 text-2xl font-semibold text-text-primary">Inventario</h3>
                <button
                    className="bg-transparent border-none text-text-secondary hover:text-primary transition-colors cursor-pointer p-2 rounded-full hover:bg-surface-hover"
                    onClick={handlePDF}
                    title="Imprimir"
                >
                    <PrintIcon size={32} />
                </button>
            </div>

            <div className="overflow-x-auto bg-surface rounded-lg shadow-sm border border-border">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-hover text-text-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-semibold">#</th>
                            <th className="px-6 py-3 font-semibold">Codigo</th>
                            <th className="px-6 py-3 font-semibold">Nombre</th>
                            <th className="px-6 py-3 font-semibold">Saldo Fisico</th>
                            <th className="px-6 py-3 font-semibold">Costo Unitario</th>
                            <th className="px-6 py-3 font-semibold">Saldo Valorado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {inventory.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-surface-hover transition-colors">
                                <td className="px-6 py-4 font-medium text-text-muted">{index}</td>
                                <td className="px-6 py-4 font-semibold text-primary">{item.codigo}</td>
                                <td className="px-6 py-4 text-text-primary">{item.nombre}</td>
                                <td className={`px-6 py-4 font-semibold ${item.saldo > 50 ? 'text-success' : 'text-danger'}`}>{item.saldo}</td>
                                <td className="px-6 py-4 text-text-primary">{item.costo}</td>
                                <td className="px-6 py-4 text-text-primary">{(item.saldo * item.costo).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Scarce show={show} handleClose={handleClose} low={low} />
        </div>
    )
}

export default Inventario