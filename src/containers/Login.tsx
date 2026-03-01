import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { UserIcon, EyeIcon, EyeOffIcon, PackageIcon } from '../components/ui/Icons';
import '../styles/Login.css';

const Login = ({ onLogIn }: { onLogIn: () => void }) => {
    const { setUser } = useContext(AuthContext);
    const { addToast } = useToast();

    const [userDates, setUserDates] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChanges = (label: string, value: string) => {
        setUserDates({ ...userDates, [label]: value });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogin = () => {
        if (!userDates.email || !userDates.password) {
            addToast({ message: 'Por favor, rellene todos los campos.', variant: 'warning' });
            return;
        }

        setIsLoading(true);
        signInWithEmailAndPassword(auth, userDates.email, userDates.password)
            .then(() => {
                setUser(userDates);
                setIsLoading(false);
                addToast({ message: 'Inicio de sesión exitoso.', variant: 'success' });
                onLogIn();
            }).catch((error) => {
                setIsLoading(false);
                addToast({ message: `Acceso Invalido: ${error.message}`, variant: 'danger' });
            });
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <Card className="login-card" style={{ maxWidth: '400px', width: '100%', padding: '1.5rem', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
                <CardBody className="d-flex flex-column align-items-center">
                    <div className="mb-4 text-center">
                        <div className="d-inline-flex justify-content-center align-items-center mb-3" style={{ background: 'var(--surface-hover)', width: '80px', height: '80px', borderRadius: '50%' }}>
                            <PackageIcon size={48} color="var(--primary-color)" />
                        </div>
                        <h2 className="title_login m-0" style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>Modelo Base</h2>
                        <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>PEPS Engine</p>
                    </div>

                    <div className="w-100 mb-3">
                        <Input
                            type="email"
                            placeholder="Usuario (Correo electrónico)"
                            value={userDates.email}
                            onChange={(event) => handleChanges('email', event.target.value)}
                            onKeyDown={handleKeyDown}
                            icon={<UserIcon />}
                            iconPosition="right"
                        />
                    </div>

                    <div className="w-100 mb-4 position-relative">
                        <Input
                            type={!showPassword ? 'password' : 'text'}
                            placeholder="Contraseña"
                            value={userDates.password}
                            onChange={(event) => handleChanges('password', event.target.value)}
                            onKeyDown={handleKeyDown}
                            icon={
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
                                    {!showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            }
                            iconPosition="right"
                        />
                    </div>

                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleLogin}
                        className="py-2 mb-2"
                        disabled={isLoading}
                        style={{ fontWeight: 600 }}
                    >
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};

export default Login;