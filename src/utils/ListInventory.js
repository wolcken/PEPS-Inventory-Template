import apiObject from "../api/DBfirestore";
import { ListInsumos } from "./ListInsumos";

export function ListInventory() {
    const inventory = [];

    const insumos = ListInsumos();
    const entradas = apiObject.useKardexEntrada();

    insumos.forEach((insumo) => {
        var id = insumo.id;
        var codigo = insumo.codigo?.toUpperCase().trim() || 'SIN CÓDIGO';
        var medicamento = insumo.medicamento;
        var saldo = 0;
        var costo = 0;

        entradas.forEach((entrada) => {
            // Normalizar código antes de comparar
            if (String(insumo.codigo).toUpperCase().trim() === String(entrada.Codigo).toUpperCase().trim()) {
                codigo = entrada.Codigo;  // Se asigna el código correcto
                saldo += entrada.Saldo;
                costo = entrada.Costo_Unitario_Neto;
            }
        });

        inventory.push({ id, codigo, medicamento, saldo, costo });
    });

    return inventory;
}