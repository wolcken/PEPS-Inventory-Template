import apiObject from "../api/DBfirestore";
import { ListInsumos } from "./ListInsumos";

export interface InventoryItem {
    id: string;
    codigo: string;
    nombre: string;
    saldo: number;
    costo: number;
}

export function ListInventory(): InventoryItem[] {
    const inventory: InventoryItem[] = [];

    const insumos = ListInsumos();
    const entradas = apiObject.useKardexEntrada();

    insumos.forEach((insumo: any) => {
        var id = insumo.id;
        var codigo = insumo.codigo?.toUpperCase().trim() || 'SIN CÓDIGO';
        var nombre = insumo.nombre || insumo.medicamento; // Fallback
        var saldo = 0;
        var costo = 0;

        entradas.forEach((entrada: any) => {
            // Normalizar código antes de comparar
            if (String(insumo.codigo).toUpperCase().trim() === String(entrada.Codigo).toUpperCase().trim()) {
                codigo = entrada.Codigo;  // Se asigna el código correcto
                saldo += entrada.Saldo;
                costo = entrada.Costo_Unitario_Neto;
            }
        });

        inventory.push({ id, codigo, nombre, saldo, costo });
    });

    return inventory;
}