import React from 'react'
import { Table } from 'react-bootstrap'
import apiObject from '../api/DBfirestore'
import basura from '../assets/icons/basura.svg'

const ProveedoresList = () => {

    const listProviders = apiObject.useProviders();

    const handleDelete = (value: string) => {
        const confirmacion = window.confirm("¿Estás seguro de Eliminar este Proveedor?");
        if (confirmacion) {
            try {
                apiObject.deleteProvider(value);
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
                        <th>Empresa</th>
                        <th>Celular</th>
                        <th>Direccion</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {listProviders?.map((insumo, index) => (
                        <tr key={insumo.id}>
                            <td>{index}</td>
                            <td>{insumo.Empresa}</td>
                            <td>{insumo.Celular}</td>
                            <td>{insumo.Direccion}</td>
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

export default ProveedoresList