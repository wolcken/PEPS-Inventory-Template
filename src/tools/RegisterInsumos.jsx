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
        Medicamento: '',
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

        if (!date.Codigo || !date.Medicamento || !date.Descripcion || !date.UnidadMedida) {
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
            title="Nuevo Registro de Insumo"
            footer={modalFooter}
        >
            <form onSubmit={handleSave} noValidate>
                <div className="mb-3">
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
                <div className="mb-3">
                    <Input
                        label="Nombre (Medicamento/Insumo)"
                        required
                        type="text"
                        placeholder="Nombre del Medicamento / Insumo"
                        value={date.Medicamento}
                        onChange={(e) => handleChanges('Medicamento', e.target.value)}
                        error={validated && !date.Medicamento ? "Introduzca el Nombre del Medicamento." : ""}
                    />
                </div>
                <div className="mb-3">
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
                <div className="mb-3">
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