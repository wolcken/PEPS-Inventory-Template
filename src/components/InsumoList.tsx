import React from 'react'
import { Table } from 'react-bootstrap'
import apiObject from '../api/DBfirestore'
import basura from '../assets/icons/basura.svg'

const InsumoList = () => {

    const listInsumos = apiObject.useInsumos();

    const handleDelete = (value: string) => {
        const confirmacion = window.confirm("¿Estás seguro de Eliminar este Insumo?");
        if (confirmacion) {
            try {
                apiObject.deleteInsumo(value);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div style={{ margin: 10 }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Codigo</th>
                        <th>Medicamento</th>
                        <th>Descripcion</th>
                        <th>Unidad Medida</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {listInsumos?.map((insumo, index) => (
                        <tr key={insumo.id}>
                            <td>{index}</td>
                            <td>{insumo.Codigo}</td>
                            <td>{insumo.Medicamento}</td>
                            <td>{insumo.Descripcion}</td>
                            <td>{insumo.UnidadMedida}</td>
                            <td>
                                <div>
                                    <img
                                        src={basura}
                                        alt='basura'
                                        className='icon-table basura'
                                        onClick={() => handleDelete(insumo.id)}
                                        style={{ width: 20 }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default InsumoList