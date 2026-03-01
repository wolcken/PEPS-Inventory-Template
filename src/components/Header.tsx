import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink } from 'react-router-dom';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { PackageIcon, HomeIcon, ListIcon, LogOutIcon, ArchiveIcon } from './ui/Icons';


const Header = () => {
    const { setUser, setIsLoggedIn } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const confirmExit = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLogoutModal(true);
    };

    const handleExit = () => {
        signOut(auth).then(() => {
            setUser(null);
            setIsLoggedIn(false);
            setShowLogoutModal(false);
        }).catch(error => console.log(error));
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 bg-surface shadow-sm border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <NavLink to="/" className="flex items-center gap-2 text-text-primary font-bold text-xl hover:text-primary transition-colors">
                            <PackageIcon size={24} className="text-primary" />
                            PEPS-Base
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-text-primary hover:text-primary focus:outline-none p-2 rounded-md"
                        >
                            <ListIcon size={24} />
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8 items-center h-full">
                        <NavLink to="/salidas" className="flex items-center gap-2 text-text-secondary hover:text-primary font-medium transition-colors">
                            <LogOutIcon size={18} /> Salidas
                        </NavLink>
                        <NavLink to="/entradas" className="flex items-center gap-2 text-text-secondary hover:text-primary font-medium transition-colors">
                            <HomeIcon size={18} /> Entradas
                        </NavLink>
                        <NavLink to="/inventario" className="flex items-center gap-2 text-text-secondary hover:text-primary font-medium transition-colors">
                            <ArchiveIcon size={18} /> Inventario
                        </NavLink>
                        <NavLink to="/kardex" className="flex items-center gap-2 text-text-secondary hover:text-primary font-medium transition-colors">
                            <ListIcon size={18} /> Kardex
                        </NavLink>

                        {/* Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                className="flex items-center gap-2 text-text-secondary hover:text-primary font-medium transition-colors focus:outline-none"
                            >
                                Registros <span className="text-xs">▼</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface ring-1 ring-black ring-opacity-5 focus:outline-none z-50 py-1">
                                    <NavLink to="/kardex_entrada" className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-hover hover:text-primary">Kardex Entrada</NavLink>
                                    <NavLink to="/kardex_salida" className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-hover hover:text-primary">Kardex Salida</NavLink>
                                    <div className="border-t border-border my-1"></div>
                                    <NavLink to="/insumos" className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-hover hover:text-primary">Insumos</NavLink>
                                    <NavLink to="/proveedores" className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-hover hover:text-primary">Proveedores</NavLink>
                                </div>
                            )}
                        </div>

                        {/* Exit */}
                        <a href="#salir" onClick={confirmExit} className="flex items-center gap-2 text-danger hover:text-red-600 font-semibold transition-colors">
                            <LogOutIcon size={18} /> Salir
                        </a>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-surface border-t border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        <NavLink to="/salidas" className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>
                            <LogOutIcon size={18} /> Salidas
                        </NavLink>
                        <NavLink to="/entradas" className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>
                            <HomeIcon size={18} /> Entradas
                        </NavLink>
                        <NavLink to="/inventario" className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>
                            <ArchiveIcon size={18} /> Inventario
                        </NavLink>
                        <NavLink to="/kardex" className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>
                            <ListIcon size={18} /> Kardex
                        </NavLink>

                        <div className="border-t border-border my-2"></div>
                        <div className="px-3 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Registros</div>
                        <NavLink to="/kardex_entrada" className="block pl-10 pr-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>Kardex Entrada</NavLink>
                        <NavLink to="/kardex_salida" className="block pl-10 pr-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>Kardex Salida</NavLink>
                        <NavLink to="/insumos" className="block pl-10 pr-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>Insumos</NavLink>
                        <NavLink to="/proveedores" className="block pl-10 pr-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-hover" onClick={() => setIsMenuOpen(false)}>Proveedores</NavLink>

                        <div className="border-t border-border my-2"></div>
                        <a href="#salir" onClick={confirmExit} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-danger hover:bg-red-50 hover:text-red-700">
                            <LogOutIcon size={18} /> Salir
                        </a>
                    </div>
                </div>
            )}

            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} title="Cerrar Sesión" centered>
                <p className="mb-0 text-center text-lg text-text-secondary">
                    ¿Estás seguro que deseas cerrar tu sesión actual?
                </p>
                <div className="flex justify-center gap-4 mt-6">
                    <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleExit}>
                        Cerrar Sesión
                    </Button>
                </div>
            </Modal>
        </header>
    );
};

export default Header;