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
        <div className="flex justify-between w-full mt-2">
            <Button variant='outline-primary' onClick={handleClear} disabled={isLoading}>Limpiar</Button>
            <Button variant='primary' onClick={handleSave} disabled={isLoading} className="flex items-center justify-center min-w-[100px]">
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
                <div className="mb-4">
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
                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
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
                    <div className="w-1/2">
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
                <div className="mb-4">
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="proveedor@email.com (Opcional)"
                        value={date.Email}
                        onChange={(e) => handleChanges('Email', e.target.value)}
                        error={validated && date.Email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(date.Email) ? "Formato inválido" : ""}
                    />
                </div>
                <div className="mb-4">
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
