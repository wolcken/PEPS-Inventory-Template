import { PepsEngine } from '../core/services/PepsEngine';
import { Batch, OutflowRequest, OutflowResult } from '../core/models/types';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, where, writeBatch } from 'firebase/firestore';
import { app } from '../firebase';
import { BusinessConfig } from '../config/tenantConfig';

const db = getFirestore(app);

/**
 * Controller pattern to bridge React UI forms with the Pure core PepsEngine
 * and Firestore persistence.
 */
export class InventoryController {

    /**
     * Translates a new Salida request into PEPS processing and Firestore updates.
     * @param dates Form data for Outflow Request
     * @param cantidad Requested quantity
     * @returns OutflowResult
     */
    public static async registerOutflow(dates: any, cantidad: number): Promise<OutflowResult> {

        const request: OutflowRequest = {
            id_Insumo: dates.id_Insumo,
            Codigo: dates.Codigo,
            Unidad_Medida: dates.Unidad_Medida,
            Cliente: dates.Cliente,
            Nit: Number(dates.Nit),
            Factura: Number(dates.Factura),
            FechaString: dates.FechaString,
            FechaNumber: Date.now(),
            CantidadSolicitada: Number(cantidad)
        };

        try {
            // 1. Fetch the Product Document to verify Codigo
            const itemRef = doc(db, 'Insumos', dates.id_Insumo);
            const docSnap = await getDoc(itemRef);

            if (!docSnap.exists()) {
                throw new Error("No existe el insumo seleccionado");
            }

            // 2. Fetch all Batches (Entradas) for this product, sorted ascending by Date
            const entradaRef = collection(db, 'KardexEntrada');
            const q = query(
                entradaRef,
                where("Codigo", "==", String(docSnap.data().Codigo)),
                orderBy("FechaNumber", "asc")
            );

            const querySnapshot = await getDocs(q);
            const availableBatches: Batch[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                availableBatches.push({
                    ...data,
                    id: doc.id
                } as Batch);
            });

            // 3. Process PEPS logic purely in memory
            const result = PepsEngine.processOutflow(availableBatches, request);

            // 4. If transaction was cancelled due to BLOCK policy, abort DB writes
            if (result.status === 'CANCELLED') {
                throw new Error("No hay stock suficiente para realizar la salida y la política bloquea la transacción.");
            }

            // 5. Build Firestore Batch Write to ensure atomicity
            const firestoreBatch = writeBatch(db);
            let currentSequenceTime = request.FechaNumber;

            // 5a. Update Saldo in affected internal Batches
            result.batchDeductions.forEach(deduction => {
                currentSequenceTime++; // To keep KardexSalida sorted

                // Re-find the mutated batch to get its new Saldo
                const updatedBatch = availableBatches.find(b => b.id === deduction.batchId);
                if (updatedBatch) {
                    const batchDocRef = doc(db, 'KardexEntrada', deduction.batchId);
                    firestoreBatch.update(batchDocRef, { Saldo: updatedBatch.Saldo });

                    // 5b. Create individual KardexSalida entries for each deduction
                    const newSalidaRef = doc(collection(db, 'KardexSalida'));
                    firestoreBatch.set(newSalidaRef, {
                        id_Insumo: request.id_Insumo,
                        Codigo: request.Codigo,
                        FechaString: request.FechaString,
                        FechaNumber: currentSequenceTime,
                        Nit: request.Nit,
                        Cliente: request.Cliente,
                        Factura: request.Factura,
                        Unidad_Medida: request.Unidad_Medida,
                        Cantidad: deduction.quantityDeducted,
                        Costo_Unitario_Neto: deduction.unitCost, // PEPS calculated cost
                        Costo_Total: deduction.totalCost,
                        Status: 'COMPLETED',
                        BatchId_Ref: deduction.batchId
                    });
                }
            });

            // 5c. If the transaction is PENDING (Backorder), keep a record in KardexSalida of what's missing
            if (result.status === 'PENDING' && result.remainingQuantityToProcess > 0) {
                currentSequenceTime++;
                const pendingSalidaRef = doc(collection(db, 'KardexSalida'));
                firestoreBatch.set(pendingSalidaRef, {
                    id_Insumo: request.id_Insumo,
                    Codigo: request.Codigo,
                    FechaString: request.FechaString,
                    FechaNumber: currentSequenceTime,
                    Nit: request.Nit,
                    Cliente: request.Cliente,
                    Factura: request.Factura,
                    Unidad_Medida: request.Unidad_Medida,
                    Cantidad: result.remainingQuantityToProcess,
                    Costo_Unitario_Neto: 0, // Unkown until a new batch arrives
                    Costo_Total: 0,
                    Status: 'PENDING'
                });
            }

            // 6. Commit transaction
            await firestoreBatch.commit();
            return result;

        } catch (error) {
            console.error("Error Registrando Salida", error);
            throw error;
        }
    }

    /**
     * Process a new Entry (Inflow)
     */
    public static async registerInflow(dates: any): Promise<void> {
        const taxFactor = BusinessConfig.TAX_DEDUCTION_FACTOR;

        // Core logic extraction (the UI shouldn't do this)
        const Costo_Unitario_Neto = Number(((dates.Precio_Unitario * dates.Cantidad) * taxFactor) / dates.Cantidad);
        const Valor_Neto = Number((dates.Precio_Unitario * dates.Cantidad) * taxFactor);
        const Total_Operacion = dates.Precio_Unitario * dates.Cantidad;

        const kardexRef = collection(db, 'KardexEntrada');

        await setDoc(doc(kardexRef), {
            id_Insumo: String(dates.id_Insumo),
            Codigo: String(dates.Codigo),
            id_Provider: String(dates.id_Provider),
            FechaString: String(dates.FechaString),
            FechaNumber: Number(dates.FechaNumber),
            Nit: Number(dates.Nit),
            Factura: Number(dates.Factura),
            Precio_Unitario: Number(dates.Precio_Unitario),
            Cantidad: Number(dates.Cantidad),
            Caducidad: String(dates.Caducidad || ''),
            Total_Operacion: Total_Operacion,
            Valor_Neto: Valor_Neto,
            Costo_Unitario_Neto: Costo_Unitario_Neto,
            Saldo: Number(dates.Cantidad) // Init Saldo to full Cantidad
        });

        // FUTURE ENHANCEMENT: If there were 'PENDING' outbound records, process them now with 
        // the cost of this new batch.
    }
}
