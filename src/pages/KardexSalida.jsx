import React, { useState } from 'react'
import apiObject from '../api/DBfirestore';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { ListInventory } from '../utils/ListInventory';
import { app } from '../firebase/Credenciales';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';

const db = getFirestore(app);

const KardexSalida = () => {

    const accion = Date.now();
    const objetoAction = new Date(accion);

    const listInsumos = apiObject.useInsumos();

    const listInventory = ListInventory();

    const [saldo, setSaldo] = useState('');

    const [listItems, setListItems] = useState([]);

    const [validated, setValidated] = useState(false);

    const [dates, setDates] = useState({
        id_Insumo: '',
        Codigo: '',
        FechaString: objetoAction,
        Nit: '',
        Cliente: '',
        Factura: '',
        Unidad_Medida: '',
        // Cantidad: '',
        // Costo_Unitario: '',
        // Costo_Venta: ''
    });

    const [cantidad, setCantidad] = useState('');

    const [optionInsumo, setOptionInsumo] = useState({
        id: '',
        Codigo: '',
        Medicamento: '',
        Descripcion: '',
        UnidadMedida: ''
    });

    // const listSaldos = apiObject.useListEntrada(optionInsumo.Codigo);
    // console.log(listSaldos)

    const handleChanges = (name, value) => {
        setDates({
            ...dates, [name]: value
        });
    };

    const handleCantidad = (value) => {
        setCantidad(value)
    }

    const handleSelectInsumo = (event) => {
        console.log(event.target.label)
        listInsumos.forEach((insumo) => {
            if (String(event.target.value) === String(insumo.id)) {
                setOptionInsumo({
                    id: insumo.id,
                    Codigo: insumo.Codigo,
                    Medicamento: insumo.Medicamento,
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
        listInventory.forEach((item) => {
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
                    const docs = [];
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

    const handleSubmit = (event) => {
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
                    // apiObject.createKardexSalida(dates);
                    handleClear();
                    window.location.hash = 'salidas';
                    if (cantidad <= saldo) {
                        // console.log(listItems);
                        var restante = cantidad
                        var fechaNumber = Date.now();
                        listItems.forEach((item) => {
                            // console.log(item)
                            fechaNumber += 1;
                            if (restante > 0) {
                                // console.log('se entra con' + restante);
                                if (item.Saldo >= restante) {
                                    const saldo = item.Saldo - restante;
                                    // console.log(item)
                                    // console.log(`${fechaNumber} ---- boleta con ${item.Saldo}-- se resta ${restante} ---- saldo ${saldo}`);
                                    apiObject.createKardexSalida(dates, fechaNumber, restante, item.Costo_Unitario_Neto);
                                    apiObject.updateSaldo(item.id, saldo);
                                    restante = 0;
                                } else {
                                    if (item.Saldo !== 0) {
                                        const saldo = 0;
                                        restante = restante - item.Saldo;
                                        // console.log(item)
                                        // console.log(`${fechaNumber} ---- boleta con ${item.Saldo}-- se resta ${item.Saldo} ---- saldo ${saldo}`);
                                        apiObject.createKardexSalida(dates, fechaNumber, item.Saldo, item.Costo_Unitario_Neto);
                                        apiObject.updateSaldo(item.id, saldo);
                                    }
                                }
                            }
                        })
                    } else {
                        alert("No se tiene esa Cantidad en Stock")
                    }
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
        <>
            <h3>Kardex de Salida</h3>
            <Form className='m-3' noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Select className='mb-3' value={optionInsumo.id} onChange={handleSelectInsumo} >
                    <option >Selecciona un Insumo</option>
                    {listInsumos.map((insumo) => (
                        <option key={insumo.id} value={insumo.id} >{insumo.Codigo}</option>
                    ))}
                </Form.Select>
                {optionInsumo.id !== '' ?
                    <div>
                        <h5>
                            Item Seleccionado
                        </h5>
                        <h6>Codigo: {optionInsumo.Codigo}</h6>
                        <h6>Medicamento: {optionInsumo.Medicamento}</h6>
                        <h6>Unidad de Medida: {optionInsumo.UnidadMedida}</h6>
                        <h5>Saldo {saldo}</h5>
                    </div>
                    :
                    null
                }
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom02">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Fecha"
                            value={dates.FechaString}
                            disabled
                            onChange={(e) => handleChanges('FechaString', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Elige la Fecha.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                        <Form.Label>NIT</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="NIT"
                            value={dates.Nit}
                            onChange={(e) => handleChanges('Nit', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el NIT.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom03">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Cliente"
                            value={dates.Cliente}
                            onChange={(e) => handleChanges('Cliente', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el Nombre del Cliente.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="validationCustom04">
                        <Form.Label>Factura N°</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="Factura N°"
                            value={dates.Factura}
                            onChange={(e) => handleChanges('Factura', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el N° de Factura.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom03">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Unidad de Medida"
                            value={dates.Unidad_Medida}
                            disabled
                            onChange={(e) => handleChanges('Unidad_Medida', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce la Unidad de Medida.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="validationCustom04">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="Cantidad"
                            value={cantidad}
                            onChange={(e) => handleCantidad(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce la Cantidad.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                {/* <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom05">
                        <Form.Label>Costo Unitario</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Costo Unitario"
                            value={dates.Costo_Unitario}
                            disabled
                            onChange={(e) => handleChanges('Subtotal', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el Costo Unitario.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="validationCustom03">
                        <Form.Label>Costo de Venta</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Costo de Venta"
                            value={dates.Costo_Venta}
                            disabled
                            onChange={(e) => handleChanges('Costo_Venta', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el Costo de Venta.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row> */}
                <Button type="submit">Registrar</Button>
            </Form>
        </>
    )
}

export default KardexSalida