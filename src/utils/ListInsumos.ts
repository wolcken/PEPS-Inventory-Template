import apiObject from "../api/DBfirestore";

export function ListInsumos(): any[] {
    const insumos = apiObject.useInsumos();
    const listInsumo: any[] = [];
    insumos.map((insumo: any) => (
        listInsumo.push({ id: insumo.id, codigo: insumo.Codigo, nombre: insumo.Nombre || insumo.Medicamento })
    ))
    return listInsumo
}