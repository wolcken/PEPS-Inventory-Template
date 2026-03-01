import React, { useState } from 'react'
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { useToast } from '../context/ToastContext';
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
    const { addToast } = useToast();

    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSelectInsumo = (selectedValue: string) => {
        listInsumos.forEach((insumo: any) => {
            if (String(selectedValue) === String(insumo.id)) {
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

    const handleSelectProvider = (selectedValue: string) => {
        const selectedId = String(selectedValue);
        listProviders.forEach((provider: any) => {
            if (selectedId === String(provider.id)) {
                setOptionProvider(provider.id);
                setDates(prevDates => ({
                    ...prevDates,
                    id_Provider: provider.id,
                    Nit: provider.Nit ? String(provider.Nit) : '' // 💡 NUEVO REQUERIMIENTO: AUTOFILL NIT
                }));
            }
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidated(true);

        if (!dates.id_Insumo || !dates.id_Provider || !dates.FechaString || !dates.Nit || !dates.Factura || !dates.Cantidad || !dates.Precio_Unitario) {
            addToast({ message: 'Por favor, completa todos los campos requeridos.', variant: 'warning' });
            return;
        }

        setIsLoading(true);
        try {
            const ImportInventoryController = await import('../api/InventoryController');
            const InventoryController = ImportInventoryController.InventoryController;
            await InventoryController.registerInflow(dates);

            addToast({ message: 'Registro de entrada guardado con éxito.', variant: 'success' });
            handleClear();
            window.location.hash = 'entradas';
        } catch (error: any) {
            console.error(error);
            addToast({ message: error.message || 'Ocurrió un error al registrar la entrada.', variant: 'warning' });
        } finally {
            setIsLoading(false);
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
        <div className="container mx-auto mt-6 px-4">
            <h3 className="mb-6 text-2xl font-semibold text-text-primary">Kardex de Entrada</h3>
            <form className='bg-surface p-6 rounded-lg shadow-sm border border-border' noValidate onSubmit={handleSubmit}>
                <h5 className="mb-4 border-b border-border pb-2 text-lg font-medium text-text-primary">Selección de Insumo</h5>
                <SearchableSelect
                    className='mb-4 w-100'
                    value={optionInsumo.id}
                    onChange={handleSelectInsumo}
                    placeholder="Busca por Nombre o Código..."
                    options={listInsumos.map((i: any) => ({ value: i.id, label: `${i.Codigo} - ${i.Nombre || i.Medicamento}` }))}
                />

                {optionInsumo.id !== '' && (
                    <div className="mb-6 p-4 bg-surface-hover border border-border rounded-lg">
                        <h6 className="text-text-secondary mb-1 text-sm font-medium">Item Seleccionado</h6>
                        <div className="font-semibold text-primary text-lg">{optionInsumo.Codigo} - {optionInsumo.Nombre}</div>
                        <div className="text-text-muted text-sm mt-1">Medida: {optionInsumo.UnidadMedida}</div>
                    </div>
                )}

                <h5 className="mb-4 border-b border-border pb-2 mt-8 text-lg font-medium text-text-primary">Datos de Entrada</h5>

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[250px]">
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
                    <div className="flex-1 min-w-[250px]">
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

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[250px]">
                        <SearchableSelect
                            label="Proveedor"
                            value={optionProvider}
                            onChange={handleSelectProvider}
                            placeholder="Busca Nombre de Empresa..."
                            options={listProviders.map((p: any) => ({ value: p.id, label: p.Empresa }))}
                        />
                    </div>
                    <div className="flex-1 min-w-[250px]">
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

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
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
                    <div className="flex-1 min-w-[200px]">
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
                    <div className="flex-1 min-w-[250px]">
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

                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-surface-hover rounded-lg mt-6 border border-border">
                    <div className="flex-1">
                        <Input
                            label="Total Operación (Bruto)"
                            type="text"
                            value={dates.Total_Operacion}
                            disabled
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            label="Valor Neto (Calculado)"
                            type="text"
                            value={dates.Valor_Neto}
                            disabled
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            label="Costo Unitario Neto"
                            type="text"
                            value={dates.Costo_Unitario_Neto}
                            disabled
                        />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex justify-end">
                    <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="flex items-center justify-center min-w-[200px]">
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Registrar Entrada al Inventario'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default KardexEntrada