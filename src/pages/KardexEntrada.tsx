import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
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
        <>
            <h3>Kardex de Entrada</h3>
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
                        <h6>Nombre: {optionInsumo.Nombre}</h6>
                        <h6>Unidad de Medida: {optionInsumo.UnidadMedida}</h6>
                    </div>
                    :
                    null
                }
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom02">
                        <Form.Label>Fecha de Registro</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Fecha"
                            value={dates.FechaString}
                            disabled
                            onChange={(e) => handleChanges('Fecha', e.target.value)}
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
                        <Form.Label>Proveedor</Form.Label>
                        <Form.Select className='mb-3' value={optionProvider} onChange={handleSelectProvider}>
                            <option>Selecciona un Proveedor</option>
                            {listProviders.map((provider) => (
                                <option key={provider.id} value={provider.id} >{provider.Empresa}</option>
                            ))}
                        </Form.Select>
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
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Label>Precio Unitario</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="Precio Unitario"
                            value={dates.Precio_Unitario}
                            onChange={(e) => handlePrecioUnitario(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el Precio Unitario.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom04">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="Cantidad"
                            value={dates.Cantidad}
                            onChange={(e) => handleCantidad(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce la Cantidad.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom05">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Fecha de Caducidad"
                                    value={dayjs(dates.Caducidad)}
                                    onChange={(newValue) => handleCaducidad(newValue)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Label>Total Operación</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Total Operación"
                            value={dates.Total_Operacion}
                            disabled
                            onChange={(e) => handleChanges('Total_Operacion', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el Total Operación.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom04">
                        <Form.Label>Valor Neto</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Valor Neto"
                            value={dates.Valor_Neto}
                            disabled
                            onChange={(e) => handleChanges('Valor_Neto', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el Valor Neto.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom05">
                        <Form.Label>Costo Unitario Neto</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Costo Unitario Neto"
                            value={dates.Costo_Unitario_Neto}
                            disabled
                            onChange={(e) => handleChanges('Costo_Unitario_Neto', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce el Costo Unitario Neto.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button type="submit">Registrar</Button>
            </Form>
        </>
    )
}

export default KardexEntrada