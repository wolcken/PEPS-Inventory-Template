import React, { useState } from 'react'
import apiObject from '../api/DBfirestore'
import { ListKardexInventory } from '../utils/ListKardexInventory';
import KardexTable from '../components/KardexTable';
import { PackageIcon, ArchiveIcon } from '../components/ui/Icons';
import { SearchableSelect } from '../components/ui/SearchableSelect';

const Kardex = () => {

    const listInsumos = apiObject.useInsumos();

    const listKardex = ListKardexInventory();

    const [insumo, setInsumo] = useState('');
    const [nombre, setNombre] = useState('');

    const [list, setList] = useState<any[]>([]);

    const handleInsumo = (selectedValue: string) => {
        try {
            const auxiliar = JSON.parse(selectedValue)
            setNombre(auxiliar?.Nombre || auxiliar?.Medicamento);
            setInsumo(auxiliar?.Codigo);
            const docs: any[] = [];
            listKardex.forEach((item: any) => {
                if (String(auxiliar?.Codigo) === String(item.Codigo)) {
                    docs.push(item);
                }
            });
            setList(docs);
        } catch (e) {
            console.error("Option no parseable")
        }
    }

    return (
        <div className="container mx-auto mt-6 px-4">
            <h3 className="mb-6 text-2xl font-semibold text-text-primary">Kardex Inventario</h3>
            <div className='mb-6 bg-surface p-6 pb-2 border border-border shadow-sm'>
                <h4 className="mb-4 text-lg font-medium text-text-primary border-b border-border pb-2">Selección de Producto</h4>
                <div className="mb-6 max-w-xl">
                    <SearchableSelect
                        value={insumo !== '' ? JSON.stringify({ Codigo: insumo, Nombre: nombre }) : ''}
                        onChange={handleInsumo}
                        placeholder="Busca por Nombre o Código..."
                        options={listInsumos.map((i: any) => ({
                            value: JSON.stringify(i),
                            label: `${i.Codigo} - ${i.Nombre || i.Medicamento}`
                        }))}
                    />
                </div>
                {insumo !== '' && nombre !== '' && (
                    <div className="mb-6 p-4 flex gap-4 items-center bg-surface-hover border border-border rounded-lg shadow-inner">
                        <div className="bg-white p-3 rounded-full shadow-sm text-primary">
                            <ArchiveIcon size={32} />
                        </div>
                        <div>
                            <h4 className="m-0 text-text-secondary text-sm font-medium tracking-wide">Mostrando Kardex de:</h4>
                            <div className="text-xl font-bold text-primary mt-1 tracking-tight">
                                {insumo} <span className="text-text-muted font-normal mx-1">|</span> <span className="text-text-primary">{nombre}</span>
                            </div>
                        </div>
                    </div>
                )}
                {insumo !== '' ? (
                    <KardexTable listMov={list} codigo={insumo} nombre={nombre} />
                ) : (
                    <div className="text-center mt-12 mb-12 flex flex-col items-center justify-center text-text-muted opacity-50">
                        <PackageIcon size={80} />
                        <h4 className="mt-4 text-xl">Selecciona un producto para visualizar su Kardex</h4>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Kardex