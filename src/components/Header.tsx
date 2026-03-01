import React, { useContext } from 'react'
import { Container, Nav, NavDropdown, Navbar, Offcanvas } from 'react-bootstrap'
import { AuthContext } from '../context/AuthProvider'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header = () => {

    const { setUser, setIsLoggedIn } = useContext(AuthContext);

    const handleExit = () => {
        const confirmacion = window.confirm("¿Cerrar Sesión?");
        if (confirmacion) {
            signOut(auth).then(() => {
                setUser(null);
                setIsLoggedIn(false);
            }).catch(error => console.log(error));
        }
    }

    return (
        <>
            <Navbar key={'md'} expand={'md'} className="bg-body-tertiary mb-3" bg="dark" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand href="#">PEPS</Navbar.Brand>
                    <Navbar.Toggle aria-controls={'offcanvasNavbar-expand-md'} />
                    <Navbar.Offcanvas
                        id={'offcanvasNavbar-expand-md'}
                        aria-labelledby={'offcanvasNavbarLabel-expand-md'}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={'offcanvasNavbarLabel-expand-md'}>
                                Offcanvas
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link href="#salidas">Salidas</Nav.Link>
                                <Nav.Link href="#entradas">Entradas</Nav.Link>
                                <Nav.Link href="#inventario">Inventario</Nav.Link>
                                <Nav.Link href="#kardex">Kardex</Nav.Link>
                                <NavDropdown
                                    title="Registros"
                                    id={'offcanvasNavbarDropdown-expand-md'}
                                >
                                    <NavDropdown.Item href="#kardex_entrada">
                                        Entrada
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#kardex_salida">
                                        Salida
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#insumos">
                                        Insumos
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#proveedores">
                                        Proveedores
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link href="#" onClick={handleExit}>Salir</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )
}

export default Header