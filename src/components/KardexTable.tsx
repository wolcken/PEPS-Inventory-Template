import React from 'react'
import { PrintIcon } from '../components/ui/Icons'
// @ts-ignore
import { Kardex } from '../tools/pdf/Kardex';

const KardexTable = ({ listMov, codigo, nombre }: any) => {

    var listMovimientos = listMov;
    const items: any[] = [];

    function ordenarPorFechaNumber(a: any, b: any) {
        return a.FechaNumber - b.FechaNumber;
    }

    listMovimientos.sort(ordenarPorFechaNumber);

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
    });

    const handlePDF = () => {
        Kardex(items, codigo, nombre)
    };

    var saldoUnidades = 0;
    var saldoCostos = 0;

    return (
        <div className="relative mt-12 mb-8">
            <button className="absolute -top-12 right-0 bg-transparent border-none text-text-secondary hover:text-primary p-2 transition-colors rounded-full hover:bg-surface-hover focus:outline-none" onClick={handlePDF} title="Imprimir Kardex">
                <PrintIcon size={26} />
            </button>

            <div className="overflow-x-auto rounded-lg shadow-[0_0_0_1px_var(--border-color)] bg-surface">
                <table className="w-full text-center border-collapse whitespace-nowrap text-sm">
                    <thead>
                        <tr className="bg-surface-hover text-text-secondary font-semibold border-b border-border tracking-wide uppercase text-xs">
                            <th colSpan={1} rowSpan={2} className="px-4 py-3 align-middle border-r border-border">Fecha</th>
                            <th colSpan={1} rowSpan={2} className="px-4 py-3 align-middle border-r border-border">Concepto</th>
                            <th colSpan={3} className="px-4 py-2 border-r border-border border-b border-border/50 bg-surface">Unidades</th>
                            <th colSpan={1} rowSpan={2} className="px-4 py-3 align-middle border-r border-border">Costo Unit.</th>
                            <th colSpan={3} className="px-4 py-2 border-b border-border/50 bg-surface">Costos Totales</th>
                        </tr>
                        <tr className="text-xs uppercase tracking-wider text-white">
                            <th className="px-3 py-2 bg-success/80 border-r border-white/20 font-medium">Entrada</th>
                            <th className="px-3 py-2 bg-warning/80 text-text-inverse border-r border-white/20 font-medium">Salida</th>
                            <th className="px-3 py-2 bg-primary/80 border-r border-white/20 font-medium tracking-widest text-white shadow-inner">Saldo</th>
                            <th className="px-3 py-2 bg-success/80 border-r border-white/20 font-medium">Entrada</th>
                            <th className="px-3 py-2 bg-warning/80 text-text-inverse border-r border-white/20 font-medium">Salida</th>
                            <th className="px-3 py-2 bg-primary/80 font-medium tracking-widest text-white shadow-inner">Saldo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {listMovimientos?.map((item: any, index: number) => {
                            var fecha = String(item.FechaString).slice(4, 25);
                            if (item.Movimiento === 'Entrada') {
                                saldoUnidades += item.CantidadE;
                                saldoCostos += (item.Costo_Unitario_Neto * item.CantidadE);
                                return (
                                    <tr key={index} className="hover:bg-surface-hover transition-colors">
                                        <td className="px-4 py-3 border-r border-border text-text-secondary">{fecha}</td>
                                        <td className="px-4 py-3 border-r border-border font-medium text-success">{item.Movimiento}</td>
                                        <td className="px-4 py-3 border-r border-border text-success bg-success/5 font-semibold">{item.CantidadE > 0 ? item.CantidadE : '-'}</td>
                                        <td className="px-4 py-3 border-r border-border text-text-muted">-</td>
                                        <td className="px-4 py-3 border-r border-border text-primary font-bold bg-primary/5">{saldoUnidades}</td>
                                        <td className="px-4 py-3 border-r border-border text-text-secondary">{item.Costo_Unitario_Neto}</td>
                                        <td className="px-4 py-3 border-r border-border text-success bg-success/5 font-semibold">{(item.Costo_Unitario_Neto * item.CantidadE).toFixed(2)}</td>
                                        <td className="px-4 py-3 border-r border-border text-text-muted">-</td>
                                        <td className="px-4 py-3 text-primary font-bold bg-primary/5">{(saldoCostos).toFixed(2)}</td>
                                    </tr>
                                )
                            } else {
                                saldoUnidades -= item.CantidadS;
                                saldoCostos -= (item.Costo_Unitario_Neto * item.CantidadS);
                                return (
                                    <tr key={index} className="hover:bg-surface-hover transition-colors">
                                        <td className="px-4 py-3 border-r border-border text-text-secondary">{fecha}</td>
                                        <td className="px-4 py-3 border-r border-border font-medium text-warning">{item.Movimiento}</td>
                                        <td className="px-4 py-3 border-r border-border text-text-muted">-</td>
                                        <td className="px-4 py-3 border-r border-border text-warning bg-warning/5 font-semibold">{item.CantidadS > 0 ? item.CantidadS : '-'}</td>
                                        <td className="px-4 py-3 border-r border-border text-primary font-bold bg-primary/5">{saldoUnidades}</td>
                                        <td className="px-4 py-3 border-r border-border text-text-secondary">{item.Costo_Unitario_Neto}</td>
                                        <td className="px-4 py-3 border-r border-border text-text-muted">-</td>
                                        <td className="px-4 py-3 border-r border-border text-warning bg-warning/5 font-semibold">{(item.Costo_Unitario_Neto * item.CantidadS).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-primary font-bold bg-primary/5">{(saldoCostos).toFixed(2)}</td>
                                    </tr>
                                )
                            }
                        })}
                        {(!listMovimientos || listMovimientos.length === 0) && (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-text-muted bg-surface-hover/50">
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