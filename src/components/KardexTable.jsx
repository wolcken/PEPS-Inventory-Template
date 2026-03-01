import React from 'react'
import { Table } from 'react-bootstrap'
import impresora from '../assets/images/impresora.png'
import { Kardex } from '../tools/pdf/Kardex';

const KardexTable = ({ listMov, codigo, medicamento }) => {

    var listMovimientos = listMov;
    const items = [];

    function ordenarPorFechaNumber(a, b) {
        return a.FechaNumber - b.FechaNumber;
    }

    listMovimientos.sort(ordenarPorFechaNumber);

    const style1 = {
        background: '#89E3B7'
    }

    const style2 = {
        background: '#EDB289'
    }

    const style3 = {
        background: '#89E3B7',
        fontWeight: 600
    }

    const style4 = {
        background: '#EDB289',
        fontWeight: 600
    }

    var saldo1 = 0;
    var saldo2 = 0;

    listMovimientos?.forEach((item) => {
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
        <>
            <Table bordered hover responsive className='mt-3'>
                <thead>
                    <tr>
                        <th colSpan={1} rowSpan={2} style={{ paddingBottom: 25 }}>Fecha</th>
                        <th colSpan={1} rowSpan={2} style={{ paddingBottom: 25 }}>Concepto</th>
                        <th colSpan={3}>UNIDADES</th>
                        <th colSpan={1} rowSpan={2} style={{ width: 100 }}>Costos Unitarios</th>
                        <th colSpan={3}>COSTOS TOTALES</th>
                    </tr>
                    <tr>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th style={{ background: '#43C85C' }}>Saldo</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th style={{ background: '#43C85C' }}>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {listMovimientos?.map((item, index) => {
                        var fecha = String(item.FechaString).slice(4, 25);
                        if (item.Movimiento === 'Entrada') {
                            saldoUnidades += item.CantidadE;
                            saldoCostos += (item.Costo_Unitario_Neto * item.CantidadE);
                            return (
                                <tr key={index}>
                                    <td style={style1}>{fecha}</td>
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
                                    <td style={style2}>{fecha}</td>
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
                </tbody>
            </Table>
            <img
                src={impresora}
                alt="imprimir"
                style={{
                    position: 'absolute',
                    width: 40,
                    top: 170,
                    right: 20,
                    cursor: 'pointer'
                }}
                onClick={handlePDF}
            />
        </>
    )
}

export default KardexTable