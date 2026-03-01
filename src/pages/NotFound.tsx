import React from 'react'
import { EyeOffIcon } from '../components/ui/Icons'

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="text-danger mb-6">
                <EyeOffIcon size={120} />
            </div>
            <h1 className="text-5xl font-bold text-text-primary mb-4">404 - Not Found</h1>
            <p className="text-lg text-text-secondary max-w-md">La página que estás buscando no existe o ha sido movida.</p>
        </div>
    )
}

export default NotFound