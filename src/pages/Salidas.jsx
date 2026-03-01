import React, { useState, useMemo } from 'react';
import { Table, Button } from 'react-bootstrap';
import apiObject from '../api/DBfirestore';
import Imprimir from '../components/Imprimir';

const Salidas = () => {
  const listKardexSalida = apiObject.useKardexSalida();

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ordenar por fecha (de más reciente a más antigua)
  const sortedEntries = useMemo(() => {
    return [...listKardexSalida].sort((a, b) => 
      new Date(b.FechaString) - new Date(a.FechaString)
    );
  }, [listKardexSalida]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

  // Cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Datos para impresión (sin paginación)
  const items = sortedEntries.map((item, index) => [
    index + 1, item.Codigo, item.FechaString, item.Factura, item.Cantidad, item.Costo_Unitario_Neto
  ]);

  return (
    <>
      <div style={{ margin: 10 }}>
        <h3>Salidas</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th style={{ background: '#EDB289' }}>#</th>
              <th style={{ background: '#EDB289' }}>Código</th>
              <th style={{ background: '#EDB289' }}>Fecha</th>
              <th style={{ background: '#EDB289' }}>Factura</th>
              <th style={{ background: '#EDB289' }}>Cantidad</th>
              <th style={{ background: '#EDB289' }}>C/U Neto</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((kardex, index) => (
                <tr key={index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{kardex.Codigo}</td>
                  <td>{kardex.FechaString}</td>
                  <td>{kardex.Factura}</td>
                  <td>{kardex.Cantidad}</td>
                  <td>{kardex.Costo_Unitario_Neto}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Controles de paginación */}
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

      {/* Botón para imprimir */}
      <Imprimir items={items} title='Salidas' />
    </>
  );
};

export default Salidas;