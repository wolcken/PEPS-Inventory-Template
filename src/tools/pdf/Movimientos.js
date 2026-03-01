import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import 'jspdf-autotable'

export function Movimientos(items, movimiento, headers) {

    const date = new Date();

    const doc = new jsPDF();

    //Encabezado del Documento
    doc.setFontSize(16);
    doc.text("SISTEMA PEPS", 10, 15);
    doc.setFontSize(8);
    doc.text(date.toLocaleString('es-BO') + ' (hora de Bolivia)', 130, 15);
    doc.setFontSize(14);
    doc.text(`Lista de ${movimiento}`, 90, 30);
    doc.line(80, 35, 135, 35, 'F');

    //Tabla de Activos
    const columns = headers || ['#', 'Codigo', 'Fecha', 'Cantidad', 'Precio Unitario', 'Costo Unitario Neto'];
    const data = items

    doc.autoTable({
        startY: 50,
        theme: 'striped',
        head: [columns],
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
    doc.save(`Lista de ${movimiento}`);
}