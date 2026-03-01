import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from '../containers/Layout';
import '../styles/App.css';
import Entradas from '../pages/Entradas';
import Salidas from '../pages/Salidas';
import Insumos from '../pages/Insumos';
import KardexEntrada from '../pages/KardexEntrada';
import Proveedores from '../pages/Proveedores';
import Inventario from '../pages/Inventario';
import KardexSalida from '../pages/KardexSalida';
import Home from '../pages/Home';
import KardexInventario from '../pages/KardexInventario';
import { AuthProvider } from '../context/AuthProvider';
import { ToastProvider } from '../context/ToastContext';
import { AuthRoute } from '../auth/Autentication';
import NotFound from '../pages/NotFound';

function App() {
    return (
        <div className="App">
            <HashRouter>
                <AuthProvider>
                    <ToastProvider>
                        <Layout>
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/entradas' element={<AuthRoute><Entradas /></AuthRoute>} />
                                <Route path='/salidas' element={<AuthRoute><Salidas /></AuthRoute>} />
                                <Route path='/inventario' element={<AuthRoute><Inventario /></AuthRoute>} />
                                <Route path='/kardex' element={<AuthRoute><KardexInventario /></AuthRoute>} />
                                <Route path='/kardex_entrada' element={<AuthRoute><KardexEntrada /></AuthRoute>} />
                                <Route path='/kardex_salida' element={<AuthRoute><KardexSalida /></AuthRoute>} />
                                <Route path='/proveedores' element={<AuthRoute><Proveedores /></AuthRoute>} />
                                <Route path='/insumos' element={<AuthRoute><Insumos /></AuthRoute>} />
                                <Route path='*' element={<NotFound />} />
                            </Routes>
                        </Layout>
                    </ToastProvider>
                </AuthProvider>
            </HashRouter>
        </div>
    );
}

export default App;
