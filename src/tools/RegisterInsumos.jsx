import React, { useState } from 'react'
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import apiObject from '../api/DBfirestore';

const RegisterInsumos = ({ show, handleClose }) => {

    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const [date, setDate] = useState({
        Codigo: '',
        Nombre: '',
        Descripcion: '',
        UnidadMedida: ''
    });

    React.useEffect(() => {
        if (show) {
            const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
            setDate(prev => ({ ...prev, Codigo: `INS-${randomSuffix}` }));
        }
    }, [show]);

    const handleChanges = (name, value) => {
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

        if (!date.Codigo || !date.Nombre || !date.Descripcion || !date.UnidadMedida) {
            addToast({ message: 'Todos los campos son obligatorios.', variant: 'warning' });
            return;
        }

        setIsLoading(true);

        try {
            await apiObject.createInsumo(date);
            addToast({ message: 'Insumo registrado correctamente!', variant: 'success' });
            handleExit();
        } catch (error) {
            addToast({ message: error.message || 'Error al guardar el insumo', variant: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setDate({
            Codigo: '',
            Nombre: '',
            Descripcion: '',
            UnidadMedida: ''
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
            title="Nuevo Registro de Insumo"
            footer={modalFooter}
        >
            <form onSubmit={handleSave} noValidate>
                <div className="mb-4">
                    <Input
                        label="Codigo"
                        required
                        type="text"
                        placeholder="Nuevo Codigo"
                        value={date.Codigo}
                        onChange={(e) => handleChanges('Codigo', e.target.value)}
                        error={validated && !date.Codigo ? "Introduce un Nuevo Codigo." : ""}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        label="Nombre del Insumo"
                        required
                        type="text"
                        placeholder="Nombre del Insumo"
                        value={date.Nombre}
                        onChange={(e) => handleChanges('Nombre', e.target.value)}
                        error={validated && !date.Nombre ? "Introduzca el Nombre del Insumo." : ""}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        label="Descripcion"
                        required
                        type="text"
                        placeholder="Descripcion del Insumo"
                        value={date.Descripcion}
                        onChange={(e) => handleChanges('Descripcion', e.target.value)}
                        error={validated && !date.Descripcion ? "Introduce la Descripcion." : ""}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        label="Unidad de Medida"
                        required
                        type="text"
                        placeholder="Unidad de Medida"
                        value={date.UnidadMedida}
                        onChange={(e) => handleChanges('UnidadMedida', e.target.value)}
                        error={validated && !date.UnidadMedida ? "Introduce la Unidad de Medida." : ""}
                    />
                </div>
            </form>
        </Modal>
    )
}

export default RegisterInsumos