import apiObject from "../api/DBfirestore";

export function ListKardexInventory() {

    const kardex = [];

    const entradas = apiObject.useKardexEntrada();

    const salidas = apiObject.useKardexSalida();

    entradas.forEach((entrada) => (
        kardex.push({ ...entrada, CantidadE: entrada.Cantidad, Movimiento: 'Entrada' })
    ));

    salidas.forEach((salida) => (
        kardex.push({ ...salida, CantidadS: salida.Cantidad, Movimiento: 'Salida' })
    ));

    return kardex
}