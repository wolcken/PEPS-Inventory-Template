import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import apiObject from '../api/DBfirestore';

const RegisterProviders = ({ show, handleClose }) => {

    const [validated, setValidated] = useState(false);

    const [date, setDate] = useState({
        Empresa: '',
        Celular: '',
        Direccion: ''
    });

    const handleChanges = (name, value) => {
        setDate({
            ...date, [name]: value
        });
    };

    const handleSave = (event) => {
        event.preventDefault();
        setValidated(true);
        if (date.Codigo !== ''
            && date.Empresa !== ''
            && date.Celular !== ''
            && date.Direccion !== '') {
            apiObject.createProvider(date);
            handleExit();
        }
    };

    const handleClear = () => {
        setDate({
            Empresa: '',
            Celular: '',
            Direccion: ''
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
                    <Form.Group controlId="validationEmpresa">
                        <Form.Label>Empresa</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Nombre de la Empresa"
                            value={date.Empresa}
                            onChange={(e) => handleChanges('Empresa', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce un Nombre de la Empresa.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCelular">
                        <Form.Label>Celular</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="Numero de Celular"
                            value={date.Celular}
                            onChange={(e) => handleChanges('Celular', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduzca el Numero de Celular.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationDireccion">
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Direccion de la Empresa"
                            value={date.Direccion}
                            onChange={(e) => handleChanges('Direccion', e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Introduce la Direccion.
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

export default RegisterProviders