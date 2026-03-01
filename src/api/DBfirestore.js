import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { app } from "../firebase/Credenciales";
import { useEffect, useState } from 'react';

const db = getFirestore(app);

// Verifica si el código ya existe en la base de datos
const checkInsumoExists = async (codigo) => {
    const insumoRef = collection(db, 'Insumos');
    const q = query(insumoRef, where("Codigo", "==", codigo));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Devuelve true si ya existe, false si no
};

// Create Insumo
const createInsumo = async (date) => {
    const insumoRef = collection(db, 'Insumos');

    try {
        // Transformamos el código antes de guardarlo
        const formattedCodigo = date.Codigo.toUpperCase().replace(/\s+/g, "_");

        const exists = await checkInsumoExists(formattedCodigo);
        if (exists) {
            alert('⚠️ Error: El código ya existe.');
            return;
        }

        await setDoc(doc(insumoRef), {
            Codigo: formattedCodigo, // Almacenamos el código transformado
            Medicamento: String(date.Medicamento),
            Descripcion: String(date.Descripcion),
            UnidadMedida: String(date.UnidadMedida)
        });

        alert('✅ Insumo creado con éxito');
    } catch (error) {
        console.error("Error al crear el insumo:", error);
    }
};

// Read Insumos
const useInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const getInsumo = async () => {
        try {
            const q = collection(db, 'Insumos')
            onSnapshot(q, (querySnapshot) => {
                const docs = [];
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
const deleteInsumo = async (id) => {
    try {
        await deleteDoc(doc(db, 'Insumos', id))
        alert('Eliminado con exito')
    } catch (error) {
        console.log(error)
    }
}

// Create Provider
const createProvider = async (date) => {
    const providerRef = collection(db, 'Providers');
    try {
        await setDoc(doc(providerRef), {
            Empresa: String(date.Empresa),
            Celular: Number(date.Celular),
            Direccion: String(date.Direccion)
        });
        alert('Proveedor creado con exito');
    } catch (error) {
        console.log(error);
    }
}

// Read Provider
const useProviders = () => {
    const [providers, setProviders] = useState([]);
    const getProvider = async () => {
        try {
            const q = collection(db, 'Providers')
            onSnapshot(q, (querySnapshot) => {
                const docs = [];
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
const deleteProvider = async (id) => {
    try {
        await deleteDoc(doc(db, 'Providers', id))
        alert('Eliminado con exito')
    } catch (error) {
        console.log(error)
    }
}

// Register Kardex Entrada
const createKardexEntrada = async (date) => {
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
            Saldo: Number(date.Cantidad)
        });
        alert('Registro creado con exito');
    } catch (error) {
        console.log(error);
    }
}

// Deleted Register Entrada
const deleteKardexEntrada = async (id) => {
    try {
        await deleteDoc(doc(db, 'KardexEntrada', id));
        alert('Entrada eliminada con éxito');
    } catch (error) {
        console.error('Error al eliminar la entrada:', error);
    }
};

// Read Kardex Entrada
const useKardexEntrada = () => {
    const [kardexs, setKardexs] = useState([]);
    const getKardex = async () => {
        try {
            const entradaRef = collection(db, 'KardexEntrada');
            const q = query(entradaRef, orderBy("FechaNumber", "asc"));
            onSnapshot(q, (querySnapshot) => {
                const docs = [];
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
const createKardexSalida = async (date, fechaNumber, cantidad, costo) => {
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
    const [kardexs, setKardexs] = useState([]);
    const getKardex = async () => {
        try {
            const salidaRef = collection(db, 'KardexSalida');
            const q = query(salidaRef, orderBy("FechaNumber", "asc"));
            onSnapshot(q, (querySnapshot) => {
                const docs = [];
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
const useItem = (insumo) => {
    const [item, setItem] = useState('');
    useEffect(() => {
        const entradaRef = collection(db, 'KardexEntrada');
        const getInventary = async (codigo) => {
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
    }, []);
    return item
}

// Read Lista de Entradas por Insumo Especifico
const useListEntrada = (codigo) => {
    const [listSaldos, setListSaldos] = useState([])
    const getKardex = async () => {
        try {
            const entradaRef = collection(db, 'KardexEntrada');
            const q = query(entradaRef, where("Codigo", "==", String(codigo)), orderBy("FechaNumber", "asc"));
            const querySnapshot = await getDocs(q);
            const saldos = [];
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
    }, []);
    return listSaldos
}

// Update Saldo
const updateSaldo = async (id, saldo) => {

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