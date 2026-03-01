import React, { useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import apiObject from '../api/DBfirestore';
import Imprimir from '../components/Imprimir';

const Salidas = () => {
  const listKardexSalida = apiObject.useKardexSalida();

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ordenar por fecha (de más reciente a más antigua)
  const sortedEntries = useMemo(() => {
    return [...listKardexSalida].sort((a: any, b: any) =>
      new Date(b.FechaString).getTime() - new Date(a.FechaString).getTime()
    );
  }, [listKardexSalida]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

  // Cambiar página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Datos para impresión (sin paginación)
  const items = sortedEntries.map((item, index) => [
    index + 1, item.Codigo, item.FechaString, item.Factura, item.Cantidad, item.Costo_Unitario_Neto
  ]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="m-0">Salidas</h3>
      </div>

      <div className="table-responsive card p-0 shadow-sm border-0">
        <table className="table table-striped table-hover m-0">
          <thead className="table-light">
            <tr>
              <th className="px-3">#</th>
              <th>Código</th>
              <th>Fecha</th>
              <th>Factura</th>
              <th>Cantidad</th>
              <th>C/U Neto</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((kardex, index) => (
                <tr key={index} className="align-middle">
                  <td className="px-3 fw-medium text-muted">{indexOfFirstItem + index + 1}</td>
                  <td className="fw-semibold text-primary">{kardex.Codigo}</td>
                  <td>{kardex.FechaString}</td>
                  <td>{kardex.Factura}</td>
                  <td>{kardex.Cantidad}</td>
                  <td>{kardex.Costo_Unitario_Neto}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
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

      {/* Botón para imprimir */}
      <div className="mt-4">
        <Imprimir items={items} title='Salidas' />
      </div>
    </div>
  );
};

export default Salidas;