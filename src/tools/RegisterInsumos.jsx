import React, { useState } from 'react'
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
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