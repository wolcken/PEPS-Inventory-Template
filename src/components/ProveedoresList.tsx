import React from 'react'
import apiObject from '../api/DBfirestore'
import { TrashIcon } from '../components/ui/Icons'

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
        <div className="table-responsive card mt-3 p-0 shadow-sm border-0">
            <table className="table table-striped table-hover m-0">
                <thead className="table-light">
                    <tr>
                        <th className="px-3">#</th>
                        <th>Empresa</th>
                        <th>Celular</th>
                        <th>Direccion</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {listProviders?.map((insumo, index) => (
                        <tr key={insumo.id} className="align-middle">
                            <td className="px-3 fw-medium text-muted">{index + 1}</td>
                            <td className="fw-semibold">{insumo.Empresa}</td>
                            <td>{insumo.Celular}</td>
                            <td>{insumo.Direccion}</td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-icon border-0 bg-transparent text-danger p-1" onClick={() => handleDelete(insumo.id)} title="Eliminar Proveedor">
                                    <TrashIcon size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {(!listProviders || listProviders.length === 0) && (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-muted">
                                No hay proveedores registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default ProveedoresList