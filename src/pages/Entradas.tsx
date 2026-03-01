import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import apiObject from '../api/DBfirestore';
import Imprimir from '../components/Imprimir';
import Low from '../components/Low';
import { TrashIcon } from '../components/ui/Icons';

const Entradas = () => {
    const listKardexEntrada = apiObject.useKardexEntrada();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sortedEntries = useMemo(() => {
        return [...listKardexEntrada].sort((a: any, b: any) =>
            new Date(b.FechaString).getTime() - new Date(a.FechaString).getTime()
        );
    }, [listKardexEntrada]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const lowStock = useMemo(() => {
        const fechaActual = new Date();

        return sortedEntries.filter((item) => {
            if (!item?.Caducidad) return false;

            const fechaCaducidad = new Date(item.Caducidad);
            const diferenciaDias = Math.floor((fechaCaducidad.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));

            const estaPorCaducar = diferenciaDias >= 0 && diferenciaDias <= 20;
            const yaCaducadoConSaldo = diferenciaDias < 0 && item.Saldo > 0;

            return estaPorCaducar || yaCaducadoConSaldo;
        });
    }, [sortedEntries]);

    const sortedLowStock = [...lowStock].sort((a: any, b: any) => new Date(b.Caducidad).getTime() - new Date(a.Caducidad).getTime());

    const [show, setShow] = useState(false);
    const [bandera, setBandera] = useState(true);

    useEffect(() => {
        if (bandera && lowStock.length > 0) {
            setShow(true);
        }
    }, [bandera, lowStock]);

    const handleClose = () => {
        setShow(false);
        setBandera(false);
    };

    const items = sortedEntries.map((item, index) => [
        index + 1,
        item.Codigo,
        item.Nombre,
        item.FechaString,
        item.Cantidad,
        item.Precio_Unitario,
        item.Costo_Unitario_Neto
    ]);

    const { addToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState('');

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await apiObject.deleteKardexEntrada(itemToDelete);
                addToast({ message: 'Entrada eliminada con éxito.', variant: 'success' });
            } catch (error: any) {
                addToast({ message: error.message || 'Error al eliminar entrada.', variant: 'danger' });
            } finally {
                setShowDeleteModal(false);
                setItemToDelete('');
            }
        }
    };

    return (
        <div className="container mx-auto mt-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="m-0 text-2xl font-semibold text-text-primary">Entradas</h3>
            </div>

            <div className="overflow-x-auto bg-surface rounded-lg shadow-sm border border-border">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-hover text-text-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-semibold">#</th>
                            <th className="px-6 py-3 font-semibold">Insumo</th>
                            <th className="px-6 py-3 font-semibold">Fecha</th>
                            <th className="px-6 py-3 font-semibold">Cantidad</th>
                            <th className="px-6 py-3 font-semibold">Precio Unitario</th>
                            <th className="px-6 py-3 font-semibold">Costo Unitario Neto</th>
                            <th className="px-6 py-3 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {currentItems.length > 0 ? (
                            currentItems.map((kardex, index) => (
                                <tr key={kardex.id} className="hover:bg-surface-hover transition-colors">
                                    <td className="px-6 py-4 font-medium text-text-muted">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-primary">{kardex.Codigo}</td>
                                    <td className="px-6 py-4 text-text-primary">{kardex.FechaString}</td>
                                    <td className="px-6 py-4 text-text-primary">{kardex.Cantidad}</td>
                                    <td className="px-6 py-4 text-text-primary">{kardex.Precio_Unitario}</td>
                                    <td className="px-6 py-4 text-text-primary">{kardex.Costo_Unitario_Neto}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="bg-transparent border-none text-danger p-2 rounded-full hover:bg-danger/10 transition-colors" onClick={() => confirmDelete(kardex.id)} title="Eliminar Entrada">
                                            <TrashIcon size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                    No hay registros disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index}
                        variant={currentPage === index + 1 ? 'primary' : 'outline'}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>

            <Low show={show} handleClose={handleClose} mincad={sortedLowStock} />
            <div className="mt-6">
                <Imprimir items={items} title="Entradas" />
            </div>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} title="Eliminar Entrada" centered>
                <p className="mb-0 text-center text-lg text-text-secondary">
                    ¿Estás seguro que deseas eliminar esta entrada permanentemente?
                </p>
                <div className="flex justify-center gap-4 mt-6 pt-2">
                    <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Sí, Eliminar
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Entradas;
