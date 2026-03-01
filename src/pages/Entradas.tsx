import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button } from 'react-bootstrap';
import apiObject from '../api/DBfirestore';
import Imprimir from '../components/Imprimir';
import Low from '../components/Low';
import BasuraIcon from '../assets/icons/basura.svg';

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

    // 🔥 Nueva función para confirmar antes de eliminar
    const handleDelete = (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar esta entrada?");
        if (confirmDelete) {
            apiObject.deleteKardexEntrada(id);
        }
    };

    return (
        <>
            <div style={{ margin: 10 }}>
                <h3>Entradas</h3>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th style={{ background: '#89E3B7' }}>#</th>
                            <th style={{ background: '#89E3B7' }}>Insumo</th>
                            <th style={{ background: '#89E3B7' }}>Fecha</th>
                            <th style={{ background: '#89E3B7' }}>Cantidad</th>
                            <th style={{ background: '#89E3B7' }}>Precio Unitario</th>
                            <th style={{ background: '#89E3B7' }}>Costo Unitario Neto</th>
                            <th style={{ background: '#ffbdbd' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((kardex, index) => (
                                <tr key={kardex.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{kardex.Codigo}</td>
                                    <td>{kardex.FechaString}</td>
                                    <td>{kardex.Cantidad}</td>
                                    <td>{kardex.Precio_Unitario}</td>
                                    <td>{kardex.Costo_Unitario_Neto}</td>
                                    <td>
                                        <img
                                            src={BasuraIcon}
                                            alt="Eliminar"
                                            onClick={() => handleDelete(kardex.id)}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    No hay registros disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-center mt-3">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                            onClick={() => handlePageChange(index + 1)}
                            className="mx-1"
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
            </div>

            <Low show={show} handleClose={handleClose} mincad={sortedLowStock} />
            <Imprimir items={items} title="Entradas" />
        </>
    );
};

export default Entradas;
