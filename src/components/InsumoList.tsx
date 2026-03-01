import React, { useState } from 'react'
import apiObject from '../api/DBfirestore'
import { TrashIcon } from '../components/ui/Icons'
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

const InsumoList = () => {

    const listInsumos = apiObject.useInsumos();
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
                await apiObject.deleteInsumo(itemToDelete);
                addToast({ message: 'Insumo eliminado con éxito.', variant: 'danger' });
            } catch (error: any) {
                addToast({ message: error.message || 'Error al eliminar insumo.', variant: 'danger' });
            } finally {
                setShowModal(false);
                setItemToDelete('');
            }
        }
    }

    return (
        <>
            <div className="w-full overflow-x-auto bg-surface mt-4 rounded-lg shadow-sm border border-border">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-surface-hover text-text-secondary text-xs uppercase tracking-wider border-b border-border">
                            <th className="px-4 py-3 font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">Codigo</th>
                            <th className="px-4 py-3 font-semibold">Nombre</th>
                            <th className="px-4 py-3 font-semibold">Descripcion</th>
                            <th className="px-4 py-3 font-semibold">Unidad Medida</th>
                            <th className="px-4 py-3 font-semibold text-center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listInsumos?.map((insumo, index) => (
                            <tr key={insumo.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                                <td className="px-4 py-3 font-medium text-text-muted">{index + 1}</td>
                                <td className="px-4 py-3 font-semibold text-primary">{insumo.Codigo}</td>
                                <td className="px-4 py-3 font-semibold text-text-primary">{insumo.Nombre || insumo.Medicamento}</td>
                                <td className="px-4 py-3 text-text-secondary">{insumo.Descripcion}</td>
                                <td className="px-4 py-3 text-text-secondary">{insumo.UnidadMedida}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        className="inline-flex items-center justify-center p-1.5 text-danger hover:bg-red-50 hover:text-red-700 rounded-md transition-colors focus:outline-none"
                                        onClick={() => confirmDelete(insumo.id)}
                                        title="Eliminar Insumo"
                                    >
                                        <TrashIcon size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!listInsumos || listInsumos.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                                    No hay insumos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} title="Eliminar Insumo" centered>
                <p className="mb-0 text-center text-lg text-text-secondary">
                    ¿Estás seguro que deseas eliminar este insumo permanentemente?
                </p>
                <div className="flex justify-center gap-4 mt-6">
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

export default InsumoList