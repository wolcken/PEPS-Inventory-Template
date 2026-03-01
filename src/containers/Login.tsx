import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { UserIcon, EyeIcon, EyeOffIcon, PackageIcon } from '../components/ui/Icons';
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
        <div className="flex min-h-screen items-center justify-center bg-bg-color p-4">
            <Card className="w-full max-w-md border-none shadow-lg">
                <CardBody className="flex flex-col items-center">
                    <div className="mb-6 text-center">
                        <div className="inline-flex justify-center items-center mb-4 bg-surface-hover w-20 h-20 rounded-full">
                            <PackageIcon size={48} color="var(--primary-color)" />
                        </div>
                        <h2 className="m-0 text-3xl font-bold text-text-primary">Modelo Base</h2>
                        <p className="text-text-muted mt-1 text-sm">PEPS Engine</p>
                    </div>

                    <div className="w-full mb-4">
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

                    <div className="w-full mb-6 relative">
                        <Input
                            type={!showPassword ? 'password' : 'text'}
                            placeholder="Contraseña"
                            value={userDates.password}
                            onChange={(event) => handleChanges('password', event.target.value)}
                            onKeyDown={handleKeyDown}
                            icon={
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none p-0 cursor-pointer flex text-text-muted hover:text-text-primary transition-colors focus:outline-none focus:text-primary">
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