import React, { useState } from 'react'
import apiObject from '../api/DBfirestore'
import { ListKardexInventory } from '../utils/ListKardexInventory';
import KardexTable from '../components/KardexTable';
import vacio from '../assets/images/bt21-rj.gif';

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
        <div className="container mt-4">
            <h3 className="mb-4">Kardex Inventario</h3>
            <form className='mb-4'>
                <select value={insumo} onChange={handleInsumo} className='form-select mb-4'>
                    <option>Open this select menu</option>
                    {listInsumos.map((insimo: any, index: number) => (
                        <option key={index} value={JSON.stringify(insimo)}>{insimo.Codigo} - {insimo.Nombre || insimo.Medicamento}</option>
                    ))}
                </select>
                {insumo !== '' && nombre !== ''
                    ?
                    <div className="mb-4 p-3 bg-surface border rounded">
                        <h4 className="m-0 text-primary">Codigo: {insumo}</h4>
                        <h4 className="m-0 text-primary mt-2">Nombre: {nombre}</h4>
                    </div>
                    :
                    null}
                {insumo !== '' ? <KardexTable listMov={list} codigo={insumo} medicamento={nombre} /> : <div className="text-center mt-5"><img src={vacio} alt="empty state gif" style={{ maxWidth: '200px', opacity: 0.5 }} /></div>}
            </form>
        </div>
    )
}

export default Kardex