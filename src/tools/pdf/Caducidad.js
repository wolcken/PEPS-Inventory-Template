import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-autotable';

export function Caducidad(items) {
    const date = new Date();

    const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });

    doc.setFontSize(16);
    doc.text("SISTEMA PEPS", 10, 15);
    doc.setFontSize(8);
    doc.text(date.toLocaleString('es-BO') + ' (hora de Bolivia)', 200, 15);
    doc.setFontSize(14);
    doc.text('Lista de Caducidad', 130, 30);
    doc.line(120, 35, 185, 35, 'F');

    const columns = ['#', 'Código', 'Saldo', 'Costo Unitario', 'Costo Total', 'Fecha de Caducidad', 'Observaciones'];

    const data = items.map((item, index) => {
        const [codigo, saldo, costoUnitario, costoTotal, caducidad] = item.slice(1);
        const fechaCaducidad = new Date(caducidad);
        const fechaHoy = new Date();
        const diferenciaDias = Math.floor((fechaCaducidad - fechaHoy) / (1000 * 60 * 60 * 24));

        let observacion = '';
        if (diferenciaDias >= 0 && diferenciaDias <= 20) {
            observacion = 'Próximo a caducar';
        } else if (diferenciaDias < 0) {
            observacion = 'Ya caducado';
        }

        return [
            index + 1,
            codigo,
            saldo,
            costoUnitario,
            costoTotal,
            fechaCaducidad.toLocaleDateString(),
            observacion
        ];
    });

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

    doc.save('Lista_de_Caducidad.pdf');
}