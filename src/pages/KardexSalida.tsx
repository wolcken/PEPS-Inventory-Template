import React, { useState } from 'react'
import apiObject from '../api/DBfirestore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { useToast } from '../context/ToastContext';
import { ListInventory } from '../utils/ListInventory';
import { app } from '../firebase';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';

const db = getFirestore(app);

const KardexSalida = () => {

    const accion = Date.now();

    // We store the Date string instead of Date object to satisfy the input format
    const objetoActionStr = new Date(accion).toLocaleDateString()

    const listInsumos = apiObject.useInsumos();
    const listInventory = ListInventory();
    const { addToast } = useToast();

    const [saldo, setSaldo] = useState<number | string>('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [listItems, setListItems] = useState<any[]>([]);

    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [dates, setDates] = useState({
        id_Insumo: '',
        Codigo: '',
        FechaString: objetoActionStr, // Initialized as string
        Nit: '',
        Cliente: '',
        Factura: '',
        Unidad_Medida: '',
        // Cantidad: '',
        // Costo_Unitario: '',
        // Costo_Venta: ''
    });

    const [cantidad, setCantidad] = useState<string>('');

    const [optionInsumo, setOptionInsumo] = useState({
        id: '',
        Codigo: '',
        Nombre: '', // Replaced Medicamento
        Descripcion: '',
        UnidadMedida: ''
    });

    // const listSaldos = apiObject.useListEntrada(optionInsumo.Codigo);
    // console.log(listSaldos)

    const handleChanges = (name: string, value: string) => {
        setDates({
            ...dates, [name]: value
        });
    };

    const handleCantidad = (value: string) => {
        setCantidad(value)
    }

    const handleSelectInsumo = (selectedValue: string) => {
        listInsumos.forEach((insumo: any) => {
            if (String(selectedValue) === String(insumo.id)) {
                setOptionInsumo({
                    id: insumo.id,
                    Codigo: insumo.Codigo,
                    Nombre: insumo.Nombre || insumo.Medicamento, // Data mapping fallback
                    Descripcion: insumo.Descripcion,
                    UnidadMedida: insumo.UnidadMedida
                });
                setDates({
                    ...dates,
                    id_Insumo: insumo.id,
                    Codigo: insumo.Codigo,
                    Unidad_Medida: insumo.UnidadMedida
                })
            }
        });
        listInventory.forEach((item: any) => {
            if (String(selectedValue) === String(item.id)) {
                setSaldo(item.saldo);
            }
        });
        const getListEntradasforItem = async () => {
            try {
                const itemRef = doc(db, 'Insumos', selectedValue);
                const docSnap = await getDoc(itemRef);
                if (docSnap.exists()) {
                    // console.log("Document data:", docSnap.data().Codigo);
                    const entradaRef = collection(db, 'KardexEntrada');
                    const q = query(entradaRef, where("Codigo", "==", String(docSnap.data().Codigo)), orderBy("FechaNumber", "asc"));
                    const querySnapshot = await getDocs(q);
                    const docs: any[] = [];
                    querySnapshot.forEach((doc) => {
                        docs.push({ ...doc.data(), id: doc.id })
                    });
                    setListItems(docs);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log(error)
            }
        }
        getListEntradasforItem()
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setValidated(true);

        if (!dates.id_Insumo || !dates.FechaString || !dates.Nit || !dates.Cliente || !dates.Factura || !cantidad) {
            addToast({ message: 'Por favor, ingresa los datos de salida.', variant: 'warning' });
            return;
        }

        setIsLoading(true);

        try {
            // LLamada al nuevo Controlador que abstrae PEPS y BD
            const ImportInventoryController = await import('../api/InventoryController');
            const InventoryController = ImportInventoryController.InventoryController;

            const result = await InventoryController.registerOutflow(dates, Number(cantidad));

            handleClear();
            window.location.hash = 'salidas';

            if (result.status === 'PENDING') {
                addToast({ message: `Stock insuficiente. Salida parcial: ${result.totalQuantityProcessed}, Pendientes: ${result.remainingQuantityToProcess}.`, variant: 'warning' });
            } else if (result.status === 'COMPLETED') {
                addToast({ message: 'Salida registrada con éxito', variant: 'success' });
            }

        } catch (error: any) {
            console.error("Error al procesar salida PEPS: ", error);
            addToast({ message: error.message || 'Error al guardar el Kardex de Salida', variant: 'warning' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setDates({
            id_Insumo: '',
            Codigo: '',
            FechaString: '',
            Nit: '',
            Cliente: '',
            Factura: '',
            Unidad_Medida: '',
            // Cantidad: '',
            // Costo_Unitario: '',
            // Costo_Venta: ''
        })
        setCantidad('');
        setValidated(false);
    }

    return (
        <div className="container mx-auto mt-6 px-4">
            <h3 className="mb-6 text-2xl font-semibold text-text-primary">Kardex de Salida</h3>
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
                    <div className="mb-6 p-4 bg-surface-hover border border-border rounded-lg flex justify-between items-center">
                        <div>
                            <h6 className="text-text-secondary mb-1 text-sm font-medium">Item Seleccionado</h6>
                            <div className="font-semibold text-primary text-lg">{optionInsumo.Codigo} - {optionInsumo.Nombre}</div>
                            <div className="text-text-muted text-sm mt-1">Medida: {optionInsumo.UnidadMedida}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-text-secondary text-sm font-medium">Saldo Fisico</div>
                            <h4 className="m-0 text-success text-3xl font-bold">{saldo}</h4>
                        </div>
                    </div>
                )}

                <h5 className="mb-4 border-b border-border pb-2 mt-8 text-lg font-medium text-text-primary">Datos de Salida</h5>
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[250px]">
                        <Input
                            label="Fecha"
                            required
                            type="text"
                            placeholder="Fecha de Salida"
                            value={dates.FechaString}
                            disabled
                            onChange={(e) => handleChanges('FechaString', e.target.value)}
                            error={validated && !dates.FechaString ? "Elige la Fecha." : ""}
                        />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                        <Input
                            label="NIT"
                            required
                            type="number"
                            placeholder="NIT del Cliente"
                            value={dates.Nit}
                            onChange={(e) => handleChanges('Nit', e.target.value)}
                            error={validated && !dates.Nit ? "Introduce el NIT." : ""}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[250px]">
                        <Input
                            label="Cliente/Destino"
                            required
                            type="text"
                            placeholder="Nombre del Cliente"
                            value={dates.Cliente}
                            onChange={(e) => handleChanges('Cliente', e.target.value)}
                            error={validated && !dates.Cliente ? "Introduce el Cliente." : ""}
                        />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                        <Input
                            label="Factura / Recibo N°"
                            required
                            type="number"
                            placeholder="Factura N°"
                            value={dates.Factura}
                            onChange={(e) => handleChanges('Factura', e.target.value)}
                            error={validated && !dates.Factura ? "Introduce Factura." : ""}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[250px]">
                        <Input
                            label="Unidad de Medida"
                            required
                            type="text"
                            placeholder="Unidad"
                            value={dates.Unidad_Medida}
                            disabled
                            onChange={(e) => handleChanges('Unidad_Medida', e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                        <Input
                            label="Cantidad a Retirar"
                            required
                            type="number"
                            placeholder="0"
                            value={cantidad}
                            onChange={(e) => handleCantidad(e.target.value)}
                            error={validated && !cantidad ? "Introduce la Cantidad." : ""}
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
                        ) : 'Registrar Salida de Inventario'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default KardexSalida