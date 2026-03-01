import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import logo from '../../assets/images/jazer.png'

export function Kardex(items, codigo, medicamento) {

    const date = new Date();

    const doc = new jsPDF({
        orientation: 'landscape'
    });

    //Encabezado del Documento
    doc.addImage(logo, 'png', 10, 10, 50, 10);
    doc.setFontSize(8);
    doc.text(`${date}`, 130, 15);
    doc.setFontSize(14);
    doc.text('Kardex de Inventarios', 90, 30);
    doc.line(80, 35, 145, 35, 'F');
    doc.text(`Codigo: ${codigo}`, 20, 45)
    doc.text(`Medicamento: ${medicamento}`, 20, 50)

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

    });

    //Guardar PDF con nombre especifico
    doc.save('Kardex');
}