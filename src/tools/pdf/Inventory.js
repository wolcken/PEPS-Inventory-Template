import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import 'jspdf-autotable'

export function Inventory(items) {

    const date = new Date();

    const doc = new jsPDF();

    //Encabezado del Documento
    doc.setFontSize(16);
    doc.text("SISTEMA PEPS", 10, 15);
    doc.setFontSize(8);
    doc.text(`${date}`, 130, 15);
    doc.setFontSize(14);
    doc.text('Inventario', 90, 30);
    doc.line(80, 35, 135, 35, 'F');

    //Tabla de Activos
    const columns = ['#', 'Codigo', 'Medicamento', 'Saldo', 'Costo Unitario', 'Valorado'];
    const data = items

    doc.autoTable({
        startY: 50,
        theme: 'striped',
        head: [columns],
        body: data,
    });

    //Guardar PDF con nombre especifico
    doc.save('Inventario');
}