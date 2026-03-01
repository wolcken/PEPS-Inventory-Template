import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { PackageIcon } from '../components/ui/Icons'

const Inicio = () => {

    const { user } = useContext(AuthContext);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-surface p-6 rounded-full shadow-lg border border-border text-primary inline-flex mb-8">
                <PackageIcon size={80} />
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">Primeros en Entrar,<br />Primeros en Salir</h1>
            <p className="text-lg text-text-secondary mt-2 bg-surface-hover px-4 py-2 rounded-full border border-border">Usuario activo: <strong>{user?.email}</strong></p>
        </div>
    )
}

export default Inicio