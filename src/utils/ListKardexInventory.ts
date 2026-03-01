import apiObject from "../api/DBfirestore";

export function ListKardexInventory(): any[] {

    const kardex: any[] = [];

    const entradas = apiObject.useKardexEntrada();

    const salidas = apiObject.useKardexSalida();

    entradas.forEach((entrada: any) => (
        kardex.push({ ...entrada, CantidadE: entrada.Cantidad, Movimiento: 'Entrada' })
    ));

    salidas.forEach((salida: any) => (
        kardex.push({ ...salida, CantidadS: salida.Cantidad, Movimiento: 'Salida' })
    ));

    return kardex
}