import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink } from 'react-router-dom';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { PackageIcon, HomeIcon, ListIcon, LogOutIcon, ArchiveIcon } from './ui/Icons';
import './Header.css';

const Header = () => {
    const { setUser, setIsLoggedIn } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <header className="navbar" style={{ boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="container d-flex justify-content-between align-items-center">
                <div className="navbar-brand">
                    <NavLink to="/" className="d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <PackageIcon size={24} color="var(--primary-color)" />
                        PEPS-Base
                    </NavLink>
                </div>
                <button className="navbar-toggler" onClick={toggleMenu} aria-label="Toggle navigation" style={{ color: 'var(--text-primary)' }}>
                    <ListIcon size={24} />
                </button>
                <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                    <nav className="navbar-nav d-flex align-items-center gap-5" style={{ height: '100%' }}>
                        <NavLink to="/salidas" className="nav-link d-flex align-items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                            <LogOutIcon size={18} /> Salidas
                        </NavLink>
                        <NavLink to="/entradas" className="nav-link d-flex align-items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                            <HomeIcon size={18} /> Entradas
                        </NavLink>
                        <NavLink to="/inventario" className="nav-link d-flex align-items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                            <ArchiveIcon size={18} /> Inventario
                        </NavLink>
                        <NavLink to="/kardex" className="nav-link d-flex align-items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                            <ListIcon size={18} /> Kardex
                        </NavLink>

                        <div className="nav-item dropdown">
                            <span className="nav-link dropdown-toggle d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                                Registros ▾
                            </span>
                            <div className="dropdown-menu shadow-sm border-0" style={{ backgroundColor: 'var(--surface-color)' }}>
                                <NavLink to="/kardex_entrada" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Kardex Entrada</NavLink>
                                <NavLink to="/kardex_salida" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Kardex Salida</NavLink>
                                <div className="dropdown-divider"></div>
                                <NavLink to="/insumos" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Insumos</NavLink>
                                <NavLink to="/proveedores" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Proveedores</NavLink>
                            </div>
                        </div>

                        <a href="#salir" className="nav-link text-danger d-flex align-items-center gap-2" style={{ fontWeight: '600' }} onClick={confirmExit}>
                            <LogOutIcon size={18} /> Salir
                        </a>
                    </nav>
                </div>
            </div>

            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} title="Cerrar Sesión" centered>
                <p className="mb-0 text-center" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    ¿Estás seguro que deseas cerrar tu sesión actual?
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4 pt-2">
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