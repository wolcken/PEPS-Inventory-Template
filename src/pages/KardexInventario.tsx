import React, { useState } from 'react'
import apiObject from '../api/DBfirestore'
import { ListKardexInventory } from '../utils/ListKardexInventory';
import KardexTable from '../components/KardexTable';
import { PackageIcon } from '../components/ui/Icons';

const Kardex = () => {

    const listInsumos = apiObject.useInsumos();

    const listKardex = ListKardexInventory();

    const [insumo, setInsumo] = useState('');
    const [nombre, setNombre] = useState('');

    const [list, setList] = useState<any[]>([]);

    const handleInsumo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const auxiliar = JSON.parse(event.target.value)
            setNombre(auxiliar?.Nombre || auxiliar?.Medicamento);
            setInsumo(auxiliar?.Codigo);
            const docs: any[] = [];
            listKardex.forEach((item: any) => {
                if (String(auxiliar?.Codigo) === String(item.Codigo)) {
                    docs.push(item);
                }
            });
            setList(docs);
        } catch (e) {
            console.error("Option no parseable")
        }
    }

    return (
        <div className="container mx-auto mt-6 px-4">
            <h3 className="mb-6 text-2xl font-semibold text-text-primary">Kardex Inventario</h3>
            <form className='mb-6 bg-surface p-6 border border-border rounded-lg shadow-sm'>
                <select value={insumo} onChange={handleInsumo} className='w-full px-4 py-2 bg-surface text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color mb-6'>
                    <option>Open this select menu</option>
                    {listInsumos.map((insimo: any, index: number) => (
                        <option key={index} value={JSON.stringify(insimo)}>{insimo.Codigo} - {insimo.Nombre || insimo.Medicamento}</option>
                    ))}
                </select>
                {insumo !== '' && nombre !== ''
                    ?
                    <div className="mb-6 p-4 bg-surface-hover border border-border rounded-lg">
                        <h4 className="m-0 text-primary text-xl font-semibold">Codigo: {insumo}</h4>
                        <h4 className="m-0 text-primary text-xl font-semibold mt-2">Nombre: {nombre}</h4>
                    </div>
                    :
                    null}
                {insumo !== '' ? <KardexTable listMov={list} codigo={insumo} medicamento={nombre} /> : <div className="text-center mt-12 mb-12 flex flex-col items-center justify-center text-text-muted opacity-50"><PackageIcon size={80} /><h4 className="mt-4 text-xl">Selecciona un modelo base de los insumos</h4></div>}
            </form>
        </div>
    )
}

export default Kardex