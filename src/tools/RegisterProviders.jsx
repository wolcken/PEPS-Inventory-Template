import React, { useState } from 'react'
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
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
        if (date.Empresa !== ''
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

    const modalFooter = (
        <div className="d-flex justify-content-between w-100 mt-2">
            <Button variant='outline-primary' onClick={handleClear}>Limpiar</Button>
            <Button variant='primary' onClick={handleSave}>Guardar</Button>
        </div>
    );

    return (
        <Modal
            show={show}
            onHide={handleExit}
            size="md"
            centered
            title="Nuevo Registro de Proveedor"
            footer={modalFooter}
        >
            <form onSubmit={handleSave} noValidate>
                <div className="mb-3">
                    <Input
                        label="Empresa"
                        required
                        type="text"
                        placeholder="Nombre de la Empresa"
                        value={date.Empresa}
                        onChange={(e) => handleChanges('Empresa', e.target.value)}
                        error={validated && !date.Empresa ? "Introduce un Nombre de la Empresa." : ""}
                    />
                </div>
                <div className="mb-3">
                    <Input
                        label="Celular"
                        required
                        type="number"
                        placeholder="Numero de Celular"
                        value={date.Celular}
                        onChange={(e) => handleChanges('Celular', e.target.value)}
                        error={validated && !date.Celular ? "Introduzca el Numero de Celular." : ""}
                    />
                </div>
                <div className="mb-3">
                    <Input
                        label="Direccion"
                        required
                        type="text"
                        placeholder="Direccion de la Empresa"
                        value={date.Direccion}
                        onChange={(e) => handleChanges('Direccion', e.target.value)}
                        error={validated && !date.Direccion ? "Introduce la Direccion." : ""}
                    />
                </div>
            </form>
        </Modal>
    )
}

export default RegisterProviders