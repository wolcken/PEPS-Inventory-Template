import React, { useState } from 'react'
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import apiObject from '../api/DBfirestore';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const KardexEntrada = () => {

    const accion = Date.now();
    const objetoAction = new Date(accion);

    const listInsumos = apiObject.useInsumos();

    const listProviders = apiObject.useProviders();

    const [validated, setValidated] = useState(false);

    const [dates, setDates] = useState({
        id_Insumo: '',
        Codigo: '',
        id_Provider: '',
        FechaString: objetoAction.toLocaleDateString(), // converted to string format
        FechaNumber: accion,
        Caducidad: '2024-01-01',
        Nit: '',
        Factura: '',
        Precio_Unitario: 0,
        Cantidad: 0,
        Total_Operacion: 0,
        Valor_Neto: 0,
        Costo_Unitario_Neto: 0
    });

    const [optionInsumo, setOptionInsumo] = useState({
        id: '',
        Codigo: '',
        Nombre: '', // using abstracted property
        Descripcion: '',
        UnidadMedida: ''
    });

    const [optionProvider, setOptionProvider] = useState('');

    const handleChanges = (name: string, value: string | number) => {
        setDates({
            ...dates, [name]: value
        });
    };

    const handleCaducidad = (value: any) => {
        const formattedDate = dayjs(value).format('YYYY-MM-DD');
        setDates({
            ...dates,
            Caducidad: formattedDate
        })
    }

    const handlePrecioUnitario = (value: string) => {
        setDates({
            ...dates,
            Precio_Unitario: Number(value),
            // UI should no longer calculate the net cost based on magic numbers.
            // The controller will recalculate the real net cost and total when saving to DB.
            Cantidad: dates.Cantidad,
            Total_Operacion: Number(value) * dates.Cantidad,
            Valor_Neto: 0,
            Costo_Unitario_Neto: 0
        });
    }

    const handleCantidad = (value: string) => {
        setDates({
            ...dates,
            Cantidad: Number(value),
            Precio_Unitario: dates.Precio_Unitario,
            Total_Operacion: Number(value) * dates.Precio_Unitario,
            Valor_Neto: 0,
            Costo_Unitario_Neto: 0
        });
    }

    const handleSelectInsumo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        listInsumos.forEach((insumo: any) => {
            if (String(event.target.value) === String(insumo.id)) {
                setOptionInsumo({
                    id: insumo.id,
                    Codigo: insumo.Codigo,
                    Nombre: insumo.Nombre || insumo.Medicamento, // Migration step
                    Descripcion: insumo.Descripcion,
                    UnidadMedida: insumo.UnidadMedida
                });
                setDates({
                    ...dates,
                    id_Insumo: insumo.id,
                    Codigo: insumo.Codigo
                });
            }
        });
    };

    const handleSelectProvider = (event: React.ChangeEvent<HTMLSelectElement>) => {
        listProviders.forEach((provider: any) => {
            if (String(event.target.value) === String(provider.id)) {
                setOptionProvider(provider.id);
                setDates({ ...dates, id_Provider: provider.id });
            }
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidated(true);
        if (
            dates.id_Insumo !== '' &&
            dates.id_Provider !== '' &&
            dates.FechaString !== '' &&
            dates.Nit !== '' &&
            dates.Factura !== ''
        ) {
            const confirmacion = window.confirm("¿Estás seguro de Registrar una Entrada?");
            if (confirmacion) {
                try {
                    const ImportInventoryController = await import('../api/InventoryController');
                    const InventoryController = ImportInventoryController.InventoryController;
                    await InventoryController.registerInflow(dates);
                    handleClear();
                    window.location.hash = 'entradas';
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    const handleClear = () => {
        setDates({
            id_Insumo: '',
            Codigo: '',
            id_Provider: '',
            FechaString: '',
            FechaNumber: 0,
            Caducidad: '',
            Nit: '',
            Factura: '',
            Precio_Unitario: 0,
            Cantidad: 0,
            Total_Operacion: 0,
            Valor_Neto: 0,
            Costo_Unitario_Neto: 0
        })
        setValidated(false);
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Kardex de Entrada</h3>
            <form className='card p-4 shadow-sm bg-surface' noValidate onSubmit={handleSubmit}>
                <h5 className="mb-3 border-bottom pb-2">Selección de Insumo</h5>
                <Select
                    className='mb-4'
                    value={optionInsumo.id}
                    onChange={handleSelectInsumo}
                    options={listInsumos.map((i: any) => ({ value: i.id, label: `${i.Codigo} - ${i.Nombre || i.Medicamento}` }))}
                />

                {optionInsumo.id !== '' && (
                    <div className="mb-4 p-3 bg-surface border rounded">
                        <h6 className="text-secondary mb-1">Item Seleccionado</h6>
                        <div className="font-semibold text-primary">{optionInsumo.Codigo} - {optionInsumo.Nombre}</div>
                        <div className="text-muted small">Medida: {optionInsumo.UnidadMedida}</div>
                    </div>
                )}

                <h5 className="mb-3 border-bottom pb-2 mt-4">Datos de Entrada</h5>

                <div className="d-flex flex-wrap gap-4 mb-3">
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                        <Input
                            label="Fecha de Registro"
                            required
                            type="text"
                            placeholder="Fecha"
                            value={dates.FechaString}
                            disabled
                            onChange={(e) => handleChanges('FechaString', e.target.value)}
                            error={validated && !dates.FechaString ? "Elige la Fecha." : ""}
                        />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                        <Input
                            label="NIT del Proveedor"
                            required
                            type="number"
                            placeholder="NIT"
                            value={dates.Nit}
                            onChange={(e) => handleChanges('Nit', e.target.value)}
                            error={validated && !dates.Nit ? "Introduce el NIT." : ""}
                        />
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-4 mb-3">
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                        <Select
                            label="Proveedor"
                            value={optionProvider}
                            onChange={handleSelectProvider}
                            options={listProviders.map((p: any) => ({ value: p.id, label: p.Empresa }))}
                        />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                        <Input
                            label="Factura N°"
                            required
                            type="number"
                            placeholder="Factura N°"
                            value={dates.Factura}
                            onChange={(e) => handleChanges('Factura', e.target.value)}
                            error={validated && !dates.Factura ? "Introduce Factura." : ""}
                        />
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-4 mb-3">
                    <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                        <Input
                            label="Precio Unitario (Bruto)"
                            required
                            type="number"
                            placeholder="0.00"
                            value={dates.Precio_Unitario}
                            onChange={(e) => handlePrecioUnitario(e.target.value)}
                            error={validated && !dates.Precio_Unitario ? "Introduce Precio." : ""}
                        />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                        <Input
                            label="Cantidad"
                            required
                            type="number"
                            placeholder="0"
                            value={dates.Cantidad}
                            onChange={(e) => handleCantidad(e.target.value)}
                            error={validated && !dates.Cantidad ? "Introduce Cantidad." : ""}
                        />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ pt: 1 }}>
                                <DatePicker
                                    label="Fecha de Caducidad"
                                    value={dayjs(dates.Caducidad)}
                                    onChange={(newValue) => handleCaducidad(newValue)}
                                    sx={{ width: '100%' }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-4 mb-4 p-3 bg-light rounded mt-4 border">
                    <div className="flex-grow-1">
                        <Input
                            label="Total Operación (Bruto)"
                            type="text"
                            value={dates.Total_Operacion}
                            disabled
                        />
                    </div>
                    <div className="flex-grow-1">
                        <Input
                            label="Valor Neto (Calculado)"
                            type="text"
                            value={dates.Valor_Neto}
                            disabled
                        />
                    </div>
                    <div className="flex-grow-1">
                        <Input
                            label="Costo Unitario Neto"
                            type="text"
                            value={dates.Costo_Unitario_Neto}
                            disabled
                        />
                    </div>
                </div>

                <div className="mt-4 pt-3 border-top text-right">
                    <Button type="submit" variant="primary" size="lg">Registrar Entrada al Inventario</Button>
                </div>
            </form>
        </div>
    )
}

export default KardexEntrada