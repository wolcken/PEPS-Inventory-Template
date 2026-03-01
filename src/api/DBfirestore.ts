import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { app } from "../firebase";
import { useEffect, useState } from 'react';

const db = getFirestore(app);

// Verifica si el código ya existe en la base de datos
const checkInsumoExists = async (codigo: string) => {
    const insumoRef = collection(db, 'Insumos');
    const q = query(insumoRef, where("Codigo", "==", codigo));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Devuelve true si ya existe, false si no
};

// Create Insumo (Product)
const createInsumo = async (date: any) => {
    const insumoRef = collection(db, 'Insumos');

    try {
        // Transformamos el código antes de guardarlo
        const formattedCodigo = date.Codigo.toUpperCase().replace(/\s+/g, "_");

        const exists = await checkInsumoExists(formattedCodigo);
        if (exists) {
            throw new Error('El código ya existe.');
        }

        await setDoc(doc(insumoRef), {
            Codigo: formattedCodigo, // Almacenamos el código transformado
            Nombre: String(date.Medicamento || date.Nombre), // REFACTOR: Fallback to either input state binding
            Descripcion: String(date.Descripcion),
            UnidadMedida: String(date.UnidadMedida)
        });

        return { success: true, message: 'Insumo creado con éxito' };
    } catch (error: any) {
        throw error;
    }
};

// Read Insumos
const useInsumos = () => {
    const [insumos, setInsumos] = useState<any[]>([]);
    const getInsumo = async () => {
        try {
            const q = collection(db, 'Insumos')
            onSnapshot(q, (querySnapshot) => {
                const docs: any[] = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ ...doc.data(), id: doc.id })
                })
                setInsumos(docs)
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getInsumo();
        // eslint-disable-next-line
    }, []);
    return insumos
}

//Delete Insumo
const deleteInsumo = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'Insumos', id))
        return { success: true };
    } catch (error: any) {
        throw error;
    }
}

// Create Provider
const createProvider = async (date: any) => {
    const providerRef = collection(db, 'Providers');
    try {
        await setDoc(doc(providerRef), {
            Empresa: String(date.Empresa),
            Nit: Number(date.Nit),
            Email: String(date.Email),
            Celular: Number(date.Celular),
            Direccion: String(date.Direccion)
        });
        return { success: true, message: 'Proveedor creado con éxito' };
    } catch (error: any) {
        throw error;
    }
}

// Read Provider
const useProviders = () => {
    const [providers, setProviders] = useState<any[]>([]);
    const getProvider = async () => {
        try {
            const q = collection(db, 'Providers')
            onSnapshot(q, (querySnapshot) => {
                const docs: any[] = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ ...doc.data(), id: doc.id })
                })
                setProviders(docs)
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getProvider();
        // eslint-disable-next-line
    }, []);
    return providers
}

//Delete Provider
const deleteProvider = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'Providers', id))
        return { success: true };
    } catch (error: any) {
        throw error;
    }
}

// Register Kardex Entrada
const createKardexEntrada = async (date: any) => {
    const kardexRef = collection(db, 'KardexEntrada');
    try {
        await setDoc(doc(kardexRef), {
            id_Insumo: String(date.id_Insumo),
            Codigo: String(date.Codigo),
            id_Provider: String(date.id_Provider),
            FechaString: String(date.FechaString),
            FechaNumber: Number(date.FechaNumber),
            Nit: Number(date.Nit),
            Factura: Number(date.Factura),
            Precio_Unitario: Number(date.Precio_Unitario),
            Cantidad: Number(date.Cantidad),
            Caducidad: String(date.Caducidad),
            Total_Operacion: Number(date.Total_Operacion),
            Valor_Neto: Number(date.Valor_Neto),
            Costo_Unitario_Neto: Number(date.Costo_Unitario_Neto),
            Saldo: Number(date.Cantidad),
            Nombre: String(date.Nombre || date.Medicamento || '')
        });
        alert('Registro creado con exito');
    } catch (error) {
        console.log(error);
    }
}

// Deleted Register Entrada
const deleteKardexEntrada = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'KardexEntrada', id));
        return { success: true };
    } catch (error: any) {
        throw error;
    }
};

// Read Kardex Entrada
const useKardexEntrada = () => {
    const [kardexs, setKardexs] = useState<any[]>([]);
    const getKardex = async () => {
        try {
            const entradaRef = collection(db, 'KardexEntrada');
            const q = query(entradaRef, orderBy("FechaNumber", "asc"));
            onSnapshot(q, (querySnapshot) => {
                const docs: any[] = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ ...doc.data(), id: doc.id })
                })
                setKardexs(docs)
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getKardex();
        // eslint-disable-next-line
    }, []);
    return kardexs
}

// Register Kardex Salida
const createKardexSalida = async (date: any, fechaNumber: number, cantidad: number, costo: number) => {
    // console.log(fechaNumber + '=>>>' + cantidad);
    const kardexRef = collection(db, 'KardexSalida');
    try {
        await setDoc(doc(kardexRef), {
            id_Insumo: String(date.id_Insumo),
            Codigo: String(date.Codigo),
            FechaString: String(date.FechaString),
            FechaNumber: Number(fechaNumber),
            Nit: Number(date.Nit),
            Cliente: String(date.Cliente),
            Factura: Number(date.Factura),
            Unidad_Medida: String(date.Unidad_Medida),
            Cantidad: Number(cantidad),
            Costo_Unitario_Neto: Number(costo)
        });
        // alert('Registro creado con exito');
    } catch (error) {
        console.log(error);
    }
}

// Read Kardex Salida
const useKardexSalida = () => {
    const [kardexs, setKardexs] = useState<any[]>([]);
    const getKardex = async () => {
        try {
            const salidaRef = collection(db, 'KardexSalida');
            const q = query(salidaRef, orderBy("FechaNumber", "asc"));
            onSnapshot(q, (querySnapshot) => {
                const docs: any[] = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ ...doc.data(), id: doc.id })
                })
                setKardexs(docs)
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getKardex();
        // eslint-disable-next-line
    }, []);
    return kardexs
}

// Read Item
const useItem = (insumo: string) => {
    const [item, setItem] = useState<{ Codigo: string, Saldo: number } | ''>('');
    useEffect(() => {
        const entradaRef = collection(db, 'KardexEntrada');
        const getInventary = async (codigo: string) => {
            try {
                const q = query(entradaRef, where("Codigo", "==", String(codigo)));
                var total = 0;
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    total += doc.data().Saldo
                });
                setItem({ Codigo: codigo, Saldo: total });
            } catch (error) {
                console.log(error);
            }
        }
        getInventary(insumo);
        // eslint-disable-next-line
    }, [insumo]);
    return item
}

// Read Lista de Entradas por Insumo Especifico
const useListEntrada = (codigo: string) => {
    const [listSaldos, setListSaldos] = useState<any[]>([])
    const getKardex = async () => {
        try {
            const entradaRef = collection(db, 'KardexEntrada');
            const q = query(entradaRef, where("Codigo", "==", String(codigo)), orderBy("FechaNumber", "asc"));
            const querySnapshot = await getDocs(q);
            const saldos: any[] = [];
            querySnapshot.forEach((doc) => {
                saldos.push(doc.data().Saldo);
            });
            setListSaldos(saldos);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getKardex();
        // eslint-disable-next-line
    }, [codigo]);
    return listSaldos
}

// Update Saldo
const updateSaldo = async (id: string, saldo: number) => {

    const entradaRef = doc(db, 'KardexEntrada', id);

    try {
        await updateDoc(entradaRef, {
            Saldo: Number(saldo)
        })
    } catch (error) {
        console.log(error)
    }
}

const apiObject = {
    checkInsumoExists,
    createInsumo,
    useInsumos,
    deleteInsumo,
    createProvider,
    useProviders,
    deleteProvider,
    createKardexEntrada,
    deleteKardexEntrada,
    useKardexEntrada,
    createKardexSalida,
    useKardexSalida,
    useItem,
    useListEntrada,
    updateSaldo
}

export default apiObject;