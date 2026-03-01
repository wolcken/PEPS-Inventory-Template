import apiObject from "../api/DBfirestore";

export function ListInsumos() {
    const insumos = apiObject.useInsumos();
    const listInsumo = [];
    insumos.map((insumo) => (
        listInsumo.push({ id: insumo.id, codigo: insumo.Codigo, medicamento: insumo.Medicamento })
    ))
    return listInsumo
}