import React, { useState } from 'react'
import apiObject from '../api/DBfirestore'
import { TrashIcon } from '../components/ui/Icons'
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

const ProveedoresList = () => {

    const listProviders = apiObject.useProviders();
    const { addToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState('');

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await apiObject.deleteProvider(itemToDelete);
                addToast({ message: 'Proveedor eliminado con éxito.', variant: 'danger' });
            } catch (error: any) {
                addToast({ message: error.message || 'Error al eliminar proveedor.', variant: 'danger' });
            } finally {
                setShowModal(false);
                setItemToDelete('');
            }
        }
    }

    return (
        <>
            <div className="table-responsive card mt-3 p-0 shadow-sm border-0">
                <table className="table table-striped table-hover m-0">
                    <thead className="table-light">
                        <tr>
                            <th className="px-3">#</th>
                            <th>Empresa</th>
                            <th>NIT</th>
                            <th>Correo Electrónico</th>
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
                                <td>{insumo.Nit || '-'}</td>
                                <td>{insumo.Email || '-'}</td>
                                <td>{insumo.Celular}</td>
                                <td>{insumo.Direccion}</td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-icon border-0 bg-transparent text-danger p-1" onClick={() => confirmDelete(insumo.id)} title="Eliminar Proveedor">
                                        <TrashIcon size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!listProviders || listProviders.length === 0) && (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-muted">
                                    No hay proveedores registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} title="Eliminar Proveedor" centered>
                <p className="mb-0 text-center" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    ¿Estás seguro que deseas eliminar este proveedor permanentemente?
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4 pt-2">
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Sí, Eliminar
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default ProveedoresList