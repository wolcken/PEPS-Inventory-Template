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
    const [medicamento, setMedicamento] = useState('');

    const [list, setList] = useState([]);

    const handleInsumo = (event) => {
        const auxiliar = JSON.parse(event.target.value)
        setMedicamento(auxiliar?.Medicamento);
        setInsumo(auxiliar?.Codigo);
        const docs = [];
        listKardex.forEach((item) => {
            if (String(auxiliar?.Codigo) === String(item.Codigo)) {
                docs.push(item);
            }
        });
        setList(docs);
    }

    return (
        <>
            <h3>Kardex Inventario</h3>
            <Form className='m-3'>
                <Form.Select value={insumo} onChange={handleInsumo} className='mb-3'>
                    <option>Open this select menu</option>
                    {listInsumos.map((insumo, index) => (
                        <option key={index} value={JSON.stringify(insumo)}>{insumo.Codigo} - {insumo.Medicamento}</option>
                    ))}
                </Form.Select>
                {insumo !== '' && medicamento !== ''
                    ?
                    <>
                        <h4>Codigo: {insumo}</h4>
                        <h4>Medicamento: {medicamento}</h4>
                    </>
                    :
                    null}
                {insumo !== '' ? <KardexTable listMov={list} codigo={insumo} medicamento={medicamento} /> : <><img src={vacio} alt="gif" /></>}
            </Form>
        </>
    )
}

export default Kardex