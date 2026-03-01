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
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">Entradas</h3>
            </div>

            <div className="table-responsive card p-0 shadow-sm border-0">
                <table className="table table-striped table-hover m-0">
                    <thead className="table-light">
                        <tr>
                            <th className="px-3">#</th>
                            <th>Insumo</th>
                            <th>Fecha</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Costo Unitario Neto</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((kardex, index) => (
                                <tr key={kardex.id} className="align-middle">
                                    <td className="px-3 fw-medium text-muted">{indexOfFirstItem + index + 1}</td>
                                    <td className="fw-semibold text-primary">{kardex.Codigo}</td>
                                    <td>{kardex.FechaString}</td>
                                    <td>{kardex.Cantidad}</td>
                                    <td>{kardex.Precio_Unitario}</td>
                                    <td>{kardex.Costo_Unitario_Neto}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-icon border-0 bg-transparent text-danger p-1" onClick={() => confirmDelete(kardex.id)} title="Eliminar Entrada">
                                            <TrashIcon size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-muted">
                                    No hay registros disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center mt-4 gap-2">
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
            <div className="mt-4">
                <Imprimir items={items} title="Entradas" />
            </div>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} title="Eliminar Entrada" centered>
                <p className="mb-0 text-center" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    ¿Estás seguro que deseas eliminar esta entrada permanentemente?
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4 pt-2">
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
