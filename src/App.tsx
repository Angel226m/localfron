/*import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './infrastructure/store/slices/authSlice';
import { RootState, AppDispatch } from './infrastructure/store/index';

// Layouts
import AdminLayout from './infrastructure/ui/layouts/AdminLayout';
import VendedorLayout from './infrastructure/ui/layouts/VendedorLayout';
import ChoferLayout from './infrastructure/ui/layouts/ChoferLayout';
import AuthLayout from './infrastructure/ui/layouts/AuthLayout';

// Pages
import LoginPage from './infrastructure/ui/pages/LoginPage';
import SelectSedePage from './infrastructure/ui/pages/SelectSedePage';
import AdminDashboard from './infrastructure/ui/pages/AdminDashboard';
import NotFoundPage from './infrastructure/ui/pages/NotFoundPage';
import ErrorPage from './infrastructure/ui/pages/ErrorPage';

// Componente para rutas protegidas
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireSede = true 
}: { 
  children: JSX.Element, 
  allowedRoles?: string[], 
  requireSede?: boolean 
}) => {
  const { isAuthenticated, user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireSede && !selectedSede && user.rol === 'ADMIN') {
    return <Navigate to="/seleccionar-sede" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol
    switch(user.rol) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'VENDEDOR':
        return <Navigate to="/vendedor/dashboard" replace />;
      case 'CHOFER':
        return <Navigate to="/chofer/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Verificar estado de autenticación al cargar la aplicación
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas *//*}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta de selección de sede (protegida para admins) *//*}
        <Route path="/seleccionar-sede" element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <SelectSedePage />
          </ProtectedRoute>
        } />
        
        {/* Rutas de administrador *//*}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Aquí irían más rutas de administrador *//*}
        </Route>
        
        {/* Rutas de vendedor *//*}
        <Route path="/vendedor" element={
          <ProtectedRoute allowedRoles={['VENDEDOR']}>
            <VendedorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Vendedor</div>} />
          {/* Aquí irían más rutas de vendedor *//*}
        </Route>
        
        {/* Rutas de chofer *//*}
        <Route path="/chofer" element={
          <ProtectedRoute allowedRoles={['CHOFER']}>
            <ChoferLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Chofer</div>} />
          {/* Aquí irían más rutas de chofer *//*}
        </Route>
        
        {/* Ruta raíz - redirige según autenticación *//*}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Página no encontrada *//*}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;*/

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './infrastructure/store/slices/authSlice';
import { RootState, AppDispatch } from './infrastructure/store/index';

// Layouts
import AdminLayout from './infrastructure/ui/layouts/AdminLayout';
import VendedorLayout from './infrastructure/ui/layouts/VendedorLayout';
import ChoferLayout from './infrastructure/ui/layouts/ChoferLayout';
import AuthLayout from './infrastructure/ui/layouts/AuthLayout';

// Pages
import LoginPage from './infrastructure/ui/pages/LoginPage';
import SelectSedePage from './infrastructure/ui/pages/SelectSedePage';
import AdminDashboard from './infrastructure/ui/pages/AdminDashboard';
import NotFoundPage from './infrastructure/ui/pages/NotFoundPage';
import ErrorPage from './infrastructure/ui/pages/ErrorPage';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ 
  children: React.ReactElement, 
  allowedRoles?: string[], 
  requireSede?: boolean 
}> = ({ 
  children, 
  allowedRoles = [], 
  requireSede = true 
}) => {
  const { isAuthenticated, user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireSede && !selectedSede && user.rol === 'ADMIN') {
    return <Navigate to="/seleccionar-sede" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol
    switch(user.rol) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'VENDEDOR':
        return <Navigate to="/vendedor/dashboard" replace />;
      case 'CHOFER':
        return <Navigate to="/chofer/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  
  // Estado para controlar intentos de verificación
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);
  
  // Verificar estado de autenticación con protección contra ciclos infinitos
  useEffect(() => {
    // Si ya hemos intentado verificar más de 2 veces y seguimos sin autenticación,
    // evitamos seguir intentando para romper el ciclo infinito
    if (authCheckAttempts > 2) {
      console.warn("Múltiples intentos fallidos de verificación de autenticación. Deteniendo el ciclo.");
      return;
    }
    
    // Si no estamos autenticados y no estamos en proceso de carga, verificar estado
    if (!auth.isAuthenticated && !auth.isLoading) {
      console.log("Verificando estado de autenticación...");
      dispatch(checkAuthStatus());
      setAuthCheckAttempts(prev => prev + 1);
    } else if (auth.isAuthenticated) {
      // Si nos autenticamos exitosamente, resetear el contador
      setAuthCheckAttempts(0);
    }
  }, [auth.isAuthenticated, auth.isLoading, authCheckAttempts, dispatch]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta de selección de sede (protegida para admins) */}
        <Route path="/seleccionar-sede" element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <SelectSedePage />
          </ProtectedRoute>
        } />
        
        {/* Rutas de administrador */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Aquí irían más rutas de administrador */}
        </Route>
        
        {/* Rutas de vendedor */}
        <Route path="/vendedor" element={
          <ProtectedRoute allowedRoles={['VENDEDOR']}>
            <VendedorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Vendedor</div>} />
          {/* Aquí irían más rutas de vendedor */}
        </Route>
        
        {/* Rutas de chofer */}
        <Route path="/chofer" element={
          <ProtectedRoute allowedRoles={['CHOFER']}>
            <ChoferLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Chofer</div>} />
          {/* Aquí irían más rutas de chofer */}
        </Route>
        
        {/* Ruta raíz - redirige según autenticación */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Página no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>



      <Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="usuarios/*" element={<UsuariosPage />} />
  {/* Otras rutas para administrador */}
  <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
  <Route path="*" element={<NotFoundPage />} />
</Route>
    </BrowserRouter>
  );
};

export default App;