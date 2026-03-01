import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import 'jspdf-autotable'

export function Kardex(items, codigo, nombre) {

    const date = new Date();

    const doc = new jsPDF({
        orientation: 'landscape'
    });

    //Encabezado del Documento
    doc.setFontSize(16);
    doc.text("SISTEMA PEPS", 10, 15);
    doc.setFontSize(8);
    doc.text(date.toLocaleString('es-BO') + ' (hora de Bolivia)', 200, 15);
    doc.setFontSize(14);
    doc.text('Kardex de Inventarios', 90, 30);
    doc.line(80, 35, 145, 35, 'F');
    doc.text(`Codigo: ${codigo}`, 20, 45)
    doc.text(`Nombre: ${nombre}`, 20, 50)

    // Define el encabezado de la tabla
    const headers = [
        [
            { content: 'Fecha', styles: { paddingBottom: 25 } },
            { content: 'Concepto', styles: { paddingBottom: 25 } },
            { content: 'UNIDADES', colSpan: 3 },
            { content: 'Costos', styles: { width: 100 } },
            { content: 'COSTOS TOTALES', colSpan: 3 }
        ],
        ['  ', '  ', 'Entrada', 'Salida', 'Saldo', 'Unitarios', 'Entrada', 'Salida', 'Saldo']
    ];

    // Define el contenido de la tabla
    const data = items

    doc.autoTable({
        startY: 60,
        theme: 'striped',
        head: headers,
        body: data,
        styles: { fontSize: 8 },
        headStyles: {
            fillColor: [52, 73, 94],
            textColor: 255,
            halign: 'center'
        },
        bodyStyles: { halign: 'center' }
    });

    //Guardar PDF con nombre especifico
    doc.save('Kardex');
}