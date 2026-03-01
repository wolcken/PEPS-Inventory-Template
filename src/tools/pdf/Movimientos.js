import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import 'jspdf-autotable'

export function Movimientos(items, movimiento) {

    const date = new Date();

    const doc = new jsPDF();

    //Encabezado del Documento
    doc.setFontSize(16);
    doc.text("SISTEMA PEPS", 10, 15);
    doc.setFontSize(8);
    doc.text(`${date}`, 130, 15);
    doc.setFontSize(14);
    doc.text(`Lista de ${movimiento}`, 90, 30);
    doc.line(80, 35, 135, 35, 'F');

    //Tabla de Activos
    const columns = ['#', 'Codigo', 'Fecha', 'Cantidad', 'Precio Unitario', 'Costo Unitario Neto'];
    const data = items

    doc.autoTable({
        startY: 50,
        theme: 'striped',
        head: [columns],
        body: data,
    });

    //Guardar PDF con nombre especifico
    doc.save(`Lista de ${movimiento}`);
}