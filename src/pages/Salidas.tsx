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
    <div className="container mx-auto mt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="m-0 text-2xl font-semibold text-text-primary">Salidas</h3>
      </div>

      <div className="overflow-x-auto bg-surface rounded-lg shadow-sm border border-border">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-hover text-text-secondary border-b border-border">
            <tr>
              <th className="px-6 py-3 font-semibold">#</th>
              <th className="px-6 py-3 font-semibold">Código</th>
              <th className="px-6 py-3 font-semibold">Fecha</th>
              <th className="px-6 py-3 font-semibold">Factura</th>
              <th className="px-6 py-3 font-semibold">Cantidad</th>
              <th className="px-6 py-3 font-semibold">C/U Neto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentItems.length > 0 ? (
              currentItems.map((kardex, index) => (
                <tr key={index} className="hover:bg-surface-hover transition-colors">
                  <td className="px-6 py-4 font-medium text-text-muted">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{kardex.Codigo}</td>
                  <td className="px-6 py-4 text-text-primary">{kardex.FechaString}</td>
                  <td className="px-6 py-4 text-text-primary">{kardex.Factura}</td>
                  <td className="px-6 py-4 text-text-primary">{kardex.Cantidad}</td>
                  <td className="px-6 py-4 text-text-primary">{kardex.Costo_Unitario_Neto}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
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

      {/* Botón para imprimir */}
      <div className="mt-6">
        <Imprimir
          items={items}
          title='Salidas'
          headers={['#', 'Código', 'Fecha', 'Factura', 'Cantidad', 'Costo U. Neto']}
        />
      </div>
    </div>
  );
};

export default Salidas;