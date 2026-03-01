import React from 'react'
import { PrintIcon } from '../components/ui/Icons'
// @ts-ignore
import { Kardex } from '../tools/pdf/Kardex';

const KardexTable = ({ listMov, codigo, medicamento }: any) => {

    var listMovimientos = listMov;
    const items: any[] = [];

    function ordenarPorFechaNumber(a: any, b: any) {
        return a.FechaNumber - b.FechaNumber;
    }

    listMovimientos.sort(ordenarPorFechaNumber);

    const style1 = {
        background: 'var(--color-success-light)',
        color: 'var(--color-success-dark)'
    }

    const style2 = {
        background: 'var(--color-warning-light)',
        color: 'var(--color-warning-dark)'
    }

    const style3 = {
        background: 'var(--color-success-light)',
        color: 'var(--color-success-dark)',
        fontWeight: 600
    }

    const style4 = {
        background: 'var(--color-warning-light)',
        color: 'var(--color-warning-dark)',
        fontWeight: 600
    }

    var saldo1 = 0;
    var saldo2 = 0;

    listMovimientos?.forEach((item: any) => {
        if (item.Movimiento === 'Entrada') {
            saldo1 += item.CantidadE;
            saldo2 += (item.Costo_Unitario_Neto * item.CantidadE);
            items.push([String(item.FechaString).slice(4, 25), item.Movimiento, item.CantidadE, item.CantidadS, saldo1, item.Costo_Unitario_Neto, (item.Costo_Unitario_Neto * item.CantidadE).toFixed(2), '', (saldo2).toFixed(2)])
        } else {
            saldo1 -= item.CantidadS;
            saldo2 -= (item.Costo_Unitario_Neto * item.CantidadS);
            items.push([String(item.FechaString).slice(4, 25), item.Movimiento, item.CantidadE, item.CantidadS, saldo1, item.Costo_Unitario_Neto, '', (item.Costo_Unitario_Neto * item.CantidadS).toFixed(2), (saldo2).toFixed(2)])
        }
    })

    const handlePDF = () => {
        Kardex(items, codigo, medicamento)
    }

    var saldoUnidades = 0;
    var saldoCostos = 0;

    return (
        <div className="position-relative mt-4">
            <button className="btn btn-icon position-absolute border-0 bg-transparent text-secondary p-1" style={{ top: -45, right: 0 }} onClick={handlePDF} title="Imprimir Kardex">
                <PrintIcon size={26} />
            </button>

            <div className="table-responsive card p-0 shadow-sm border-0">
                <table className="table table-bordered table-hover m-0 text-center align-middle" style={{ fontSize: '0.9rem' }}>
                    <thead className="table-light font-semibold">
                        <tr>
                            <th colSpan={1} rowSpan={2} className="align-middle px-3">Fecha</th>
                            <th colSpan={1} rowSpan={2} className="align-middle">Concepto</th>
                            <th colSpan={3} className="bg-light">UNIDADES</th>
                            <th colSpan={1} rowSpan={2} className="align-middle text-nowrap" style={{ width: 100 }}>Costo Unitario</th>
                            <th colSpan={3} className="bg-light">COSTOS TOTALES</th>
                        </tr>
                        <tr>
                            <th className="bg-success text-white py-2" style={{ opacity: 0.8 }}>Entrada</th>
                            <th className="bg-warning text-dark py-2" style={{ opacity: 0.8 }}>Salida</th>
                            <th className="bg-primary text-white py-2" style={{ opacity: 0.8 }}>Saldo</th>
                            <th className="bg-success text-white py-2" style={{ opacity: 0.8 }}>Entrada</th>
                            <th className="bg-warning text-dark py-2" style={{ opacity: 0.8 }}>Salida</th>
                            <th className="bg-primary text-white py-2" style={{ opacity: 0.8 }}>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listMovimientos?.map((item: any, index: number) => {
                            var fecha = String(item.FechaString).slice(4, 25);
                            if (item.Movimiento === 'Entrada') {
                                saldoUnidades += item.CantidadE;
                                saldoCostos += (item.Costo_Unitario_Neto * item.CantidadE);
                                return (
                                    <tr key={index}>
                                        <td style={style1} className="text-nowrap px-3">{fecha}</td>
                                        <td style={style1}>{item.Movimiento}</td>
                                        <td style={style1}>{item.CantidadE > 0 ? item.CantidadE : '-'}</td>
                                        <td style={style1}>{item.CantidadS > 0 ? item.CantidadS : '-'}</td>
                                        <td style={style3}>{saldoUnidades}</td>
                                        <td style={style1}>{item.Costo_Unitario_Neto}</td>
                                        <td style={style1}>{(item.Costo_Unitario_Neto * item.CantidadE).toFixed(2)}</td>
                                        <td style={style1}>-</td>
                                        <td style={style3}>{(saldoCostos).toFixed(2)}</td>
                                    </tr>
                                )
                            } else {
                                saldoUnidades -= item.CantidadS;
                                saldoCostos -= (item.Costo_Unitario_Neto * item.CantidadS);
                                return (
                                    <tr key={index}>
                                        <td style={style2} className="text-nowrap px-3">{fecha}</td>
                                        <td style={style2}>{item.Movimiento}</td>
                                        <td style={style2}>{item.CantidadE > 0 ? item.CantidadE : '-'}</td>
                                        <td style={style2}>{item.CantidadS > 0 ? item.CantidadS : '-'}</td>
                                        <td style={style4}>{saldoUnidades}</td>
                                        <td style={style2}>{item.Costo_Unitario_Neto}</td>
                                        <td style={style2}>-</td>
                                        <td style={style2}>{(item.Costo_Unitario_Neto * item.CantidadS).toFixed(2)}</td>
                                        <td style={style4}>{(saldoCostos).toFixed(2)}</td>
                                    </tr>
                                )
                            }
                        })}
                        {(!listMovimientos || listMovimientos.length === 0) && (
                            <tr>
                                <td colSpan={9} className="text-center py-4 text-muted">
                                    No hay movimientos registrados para este insumo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default KardexTable