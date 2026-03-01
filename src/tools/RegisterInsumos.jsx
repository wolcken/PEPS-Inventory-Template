import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import apiObject from '../api/DBfirestore';

const RegisterInsumos = ({ show, handleClose }) => {

    const [validated, setValidated] = useState(false);

    const [date, setDate] = useState({
        Codigo: '',
        Medicamento: '',
        Descripcion: '',
        UnidadMedida: ''
    });

    const handleChanges = (name, value) => {
        // Si el campo es "Codigo", transformamos el texto
        if (name === "Codigo") {
            value = value.toUpperCase().replace(/\s+/g, "_");
        }

        setDate({
            ...date,
            [name]: value
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setValidated(true);

        if (!date.Codigo || !date.Medicamento || !date.Descripcion || !date.UnidadMedida) {
            alert('⚠️ Todos los campos son obligatorios.');
            return;
        }

        const exists = await apiObject.checkInsumoExists(date.Codigo);
        if (exists) {
            alert('⚠️ Error: Ya existe un insumo con este código.');
            return;
        }

        await apiObject.createInsumo(date);
        handleExit();
    };

    const handleClear = () => {
        setDate({
            Codigo: '',
            Medicamento: '',
            Descripcion: '',
            UnidadMedida: ''
        });
        setValidated(false);
    };

    const handleExit = () => {
        handleClear();
        handleClose();
    }

    return (
        <Modal
            show={show}
            onHide={handleExit}
            size="md"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Nuevo Registro
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated}>
                    <Form.Group controlId="validationCodigo">
                        <Form.Label>Codigo</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Nuevo Codigo"
                            value={date.Codigo}
                            onChange={(e) => handleChanges('Codigo', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce un Nuevo Codigo.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationMedicamento">
                        <Form.Label>Medicamento</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Nombre del Medicamento"
                            value={date.Medicamento}
                            onChange={(e) => handleChanges('Medicamento', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduzca el Nombre del Medicamento.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationDescripcion">
                        <Form.Label>Descripcion</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Descripcion del Medicamento"
                            value={date.Descripcion}
                            onChange={(e) => handleChanges('Descripcion', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce la Descripcion del Medicamento.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom03">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Unidad de Medida"
                            value={date.UnidadMedida}
                            onChange={(e) => handleChanges('UnidadMedida', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce la Unidad de Medida.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'space-between' }}>
                <Button variant='secondary' onClick={handleClear}>Limpiar</Button>
                <Button variant='primary' onClick={handleSave}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RegisterInsumos