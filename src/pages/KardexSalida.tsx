import React, { useState } from 'react'
import apiObject from '../api/DBfirestore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
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

    const [saldo, setSaldo] = useState<number | string>('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [listItems, setListItems] = useState<any[]>([]);

    const [validated, setValidated] = useState(false);

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

    const handleSelectInsumo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        listInsumos.forEach((insumo: any) => {
            if (String(event.target.value) === String(insumo.id)) {
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
            if (String(event.target.value) === String(item.id)) {
                setSaldo(item.saldo);
            }
        });
        const getListEntradasforItem = async () => {
            try {
                const itemRef = doc(db, 'Insumos', event.target.value);
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
        if (
            dates.id_Insumo !== '' &&
            dates.FechaString !== '' &&
            dates.Nit !== '' &&
            dates.Cliente !== '' &&
            dates.Factura !== '' &&
            cantidad !== ''
        ) {
            const confirmacion = window.confirm("¿Estás seguro de Registrar una Salida?");
            if (confirmacion) {
                try {
                    // LLamada al nuevo Controlador que abstrae PEPS y BD
                    const ImportInventoryController = await import('../api/InventoryController');
                    const InventoryController = ImportInventoryController.InventoryController;

                    const result = await InventoryController.registerOutflow(dates, Number(cantidad));

                    handleClear();
                    window.location.hash = 'salidas';

                    if (result.status === 'PENDING') {
                        alert(`Stock insuficiente. Se registró la salida de ${result.totalQuantityProcessed} unidades y quedaron ${result.remainingQuantityToProcess} en estado Pendiente (Backorder).`);
                    } else if (result.status === 'COMPLETED') {
                        alert('Salida registrada con éxito');
                    }

                } catch (error: any) {
                    console.error("Error al procesar salida PEPS: ", error);
                    alert("Error: " + error.message);
                }
            }
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
        <div className="container mt-4">
            <h3 className="mb-4">Kardex de Salida</h3>
            <form className='card p-4 shadow-sm bg-surface' noValidate onSubmit={handleSubmit}>

                <h5 className="mb-3 border-bottom pb-2">Selección de Insumo</h5>
                <Select
                    className='mb-4'
                    value={optionInsumo.id}
                    onChange={handleSelectInsumo}
                    options={listInsumos.map((i: any) => ({ value: i.id, label: `${i.Codigo} - ${i.Nombre || i.Medicamento}` }))}
                />

                {optionInsumo.id !== '' && (
                    <div className="mb-4 p-3 bg-surface border rounded d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-secondary mb-1">Item Seleccionado</h6>
                            <div className="font-semibold text-primary">{optionInsumo.Codigo} - {optionInsumo.Nombre}</div>
                            <div className="text-muted small">Medida: {optionInsumo.UnidadMedida}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-secondary small">Saldo Fisico</div>
                            <h4 className="m-0 text-success">{saldo}</h4>
                        </div>
                    </div>
                )}

                <h5 className="mb-3 border-bottom pb-2 mt-4">Datos de Salida</h5>
                <div className="d-flex flex-wrap gap-4 mb-3">
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
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
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
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

                <div className="d-flex flex-wrap gap-4 mb-3">
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
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
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
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

                <div className="d-flex flex-wrap gap-4 mb-4">
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
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
                    <div className="flex-grow-1" style={{ minWidth: '250px' }}>
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

                <div className="mt-4 pt-3 border-top text-right">
                    <Button type="submit" variant="primary" size="lg">Registrar Salida de Inventario</Button>
                </div>
            </form>
        </div>
    )
}

export default KardexSalida