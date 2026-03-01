import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
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
        <>
            <h3>Kardex Inventario</h3>
            <Form className='m-3'>
                <Form.Select value={insumo} onChange={handleInsumo} className='mb-3'>
                    <option>Open this select menu</option>
                    {listInsumos.map((insimo: any, index: number) => (
                        <option key={index} value={JSON.stringify(insimo)}>{insimo.Codigo} - {insimo.Nombre || insimo.Medicamento}</option>
                    ))}
                </Form.Select>
                {insumo !== '' && nombre !== ''
                    ?
                    <>
                        <h4>Codigo: {insumo}</h4>
                        <h4>Nombre: {nombre}</h4>
                    </>
                    :
                    null}
                {insumo !== '' ? <KardexTable listMov={list} codigo={insumo} medicamento={nombre} /> : <><img src={vacio} alt="gif" /></>}
            </Form>
        </>
    )
}

export default Kardex