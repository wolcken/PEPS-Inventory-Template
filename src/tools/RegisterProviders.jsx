import React, { useState } from 'react'
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import apiObject from '../api/DBfirestore';

const RegisterProviders = ({ show, handleClose }) => {

    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const [date, setDate] = useState({
        Empresa: '',
        Nit: '',
        Email: '',
        Celular: '',
        Direccion: ''
    });

    const handleChanges = (name, value) => {
        setDate({
            ...date, [name]: value
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setValidated(true);

        if (!date.Empresa || !date.Nit || !date.Celular || !date.Direccion) {
            addToast({ message: 'Por favor completa los campos requeridos.', variant: 'warning' });
            return;
        }

        setIsLoading(true);

        try {
            await apiObject.createProvider(date);
            addToast({ message: 'Proveedor registrado correctamente!', variant: 'success' });
            handleExit();
        } catch (error) {
            addToast({ message: error.message || 'Error al guardar el proveedor', variant: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setDate({
            Empresa: '',
            Nit: '',
            Email: '',
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
            <Button variant='outline-primary' onClick={handleClear} disabled={isLoading}>Limpiar</Button>
            <Button variant='primary' onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : 'Guardar'}
            </Button>
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
                <div className="d-flex gap-3 mb-3">
                    <div className="w-50">
                        <Input
                            label="NIT"
                            required
                            type="number"
                            placeholder="NIT o RUC"
                            value={date.Nit}
                            onChange={(e) => handleChanges('Nit', e.target.value)}
                            error={validated && !date.Nit ? "Introduzca el NIT." : ""}
                        />
                    </div>
                    <div className="w-50">
                        <Input
                            label="Celular"
                            required
                            type="number"
                            placeholder="Numero de Celular"
                            value={date.Celular}
                            onChange={(e) => handleChanges('Celular', e.target.value)}
                            error={validated && !date.Celular ? "Requerido." : ""}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="proveedor@email.com (Opcional)"
                        value={date.Email}
                        onChange={(e) => handleChanges('Email', e.target.value)}
                        error={validated && date.Email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(date.Email) ? "Formato inválido" : ""}
                    />
                </div>
                <div className="mb-3">
                    <Input
                        label="Direccion"
                        required
                        type="text"
                        placeholder="Direccion postal o física"
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
