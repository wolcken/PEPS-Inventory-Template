import React from 'react'
import apiObject from '../api/DBfirestore'
import { TrashIcon } from '../components/ui/Icons'

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
        <div className="table-responsive card mt-3 p-0 shadow-sm border-0">
            <table className="table table-striped table-hover m-0">
                <thead className="table-light">
                    <tr>
                        <th className="px-3">#</th>
                        <th>Codigo</th>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Unidad Medida</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {listInsumos?.map((insumo, index) => (
                        <tr key={insumo.id} className="align-middle">
                            <td className="px-3 fw-medium text-muted">{index + 1}</td>
                            <td className="fw-semibold text-primary">{insumo.Codigo}</td>
                            <td className="fw-semibold">{insumo.Nombre || insumo.Medicamento}</td>
                            <td>{insumo.Descripcion}</td>
                            <td>{insumo.UnidadMedida}</td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-icon border-0 bg-transparent text-danger p-1" onClick={() => handleDelete(insumo.id)} title="Eliminar Insumo">
                                    <TrashIcon size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {(!listInsumos || listInsumos.length === 0) && (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                                No hay insumos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default InsumoList