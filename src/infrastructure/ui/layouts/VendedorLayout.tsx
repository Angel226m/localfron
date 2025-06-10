/* 
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { logout } from '../../../infrastructure/store/slices/authSlice';

const VendedorLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar *//*}
      <div className="w-64 bg-green-800 text-white">
        <div className="p-4 border-b border-green-700">
          <h2 className="text-xl font-bold">Tours Náuticos</h2>
          <p className="text-sm text-green-300">Panel de Ventas</p>
        </div>
        
        {/* Información de usuario y sede *//*}
        <div className="p-4 border-b border-green-700">
          <p className="font-medium">{user?.nombres} {user?.apellidos}</p>
          <p className="text-sm text-green-300">{user?.rol}</p>
          
          {selectedSede && (
            <div className="mt-2 p-2 bg-green-900 rounded">
              <p className="text-sm font-medium">Sede:</p>
              <p className="text-sm">{selectedSede.nombre}</p>
            </div>
          )}
        </div>
        
        {/* Enlaces de navegación *//*}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/vendedor/dashboard" className="block p-2 hover:bg-green-700 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/vendedor/reservas" className="block p-2 hover:bg-green-700 rounded">
                Reservas
              </Link>
            </li>
            <li>
              <Link to="/vendedor/tours" className="block p-2 hover:bg-green-700 rounded">
                Tours Disponibles
              </Link>
            </li>
            <li>
              <Link to="/vendedor/clientes" className="block p-2 hover:bg-green-700 rounded">
                Clientes
              </Link>
            </li>
            <li>
              <Link to="/vendedor/pagos" className="block p-2 hover:bg-green-700 rounded">
                Pagos
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Botón de cierre de sesión *//*}
        <div className="mt-auto p-4 border-t border-green-700">
          <button 
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Contenido principal *//*}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header *//*}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              {selectedSede ? `Ventas - ${selectedSede.nombre}` : 'Ventas'}
            </h1>
          </div>
        </header>
        
        {/* Contenido principal (renderizado por las rutas) *//*}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendedorLayout;*/


import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { logout } from '../../../infrastructure/store/slices/authSlice';
import { 
  FaChartLine, 
  FaCalendarAlt, 
  FaShip, 
  FaUsers, 
  FaCreditCard, 
  FaSignOutAlt, 
  FaLifeRing
} from 'react-icons/fa';

const VendedorLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { path: '/vendedor/dashboard', name: 'Dashboard', icon: <FaChartLine size={16} /> },
    { path: '/vendedor/reservas', name: 'Reservas', icon: <FaCalendarAlt size={16} /> },
    { path: '/vendedor/tours', name: 'Tours Disponibles', icon: <FaShip size={16} /> },
    { path: '/vendedor/clientes', name: 'Clientes', icon: <FaUsers size={16} /> },
    { path: '/vendedor/pagos', name: 'Pagos', icon: <FaCreditCard size={16} /> },
    { path: '/vendedor/soporte', name: 'Soporte', icon: <FaLifeRing size={16} /> },
  ];
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white shadow-lg">
        <div className="p-4 border-b border-green-700 flex items-center space-x-2">
          <FaShip className="text-white text-xl" />
          <div>
            <h2 className="text-lg font-bold">Tours Náuticos</h2>
            <p className="text-xs text-green-200">Panel de Ventas</p>
          </div>
        </div>
        
        {/* Información de usuario y sede */}
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-green-200 text-green-800 flex items-center justify-center font-bold text-sm mr-2">
              {user?.nombres?.charAt(0) || ''}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.nombres} {user?.apellidos}</p>
              <p className="text-xs text-green-200">{user?.rol}</p>
            </div>
          </div>
          
          {selectedSede && (
            <div className="mt-2 p-2 bg-green-900 rounded text-sm">
              <p className="font-medium">Sede: {selectedSede.nombre}</p>
            </div>
          )}
        </div>
        
        {/* Enlaces de navegación */}
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center p-2 rounded text-sm ${
                    isActive(item.path) 
                      ? 'bg-green-700 text-white' 
                      : 'hover:bg-green-700/50 text-green-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Botón de cierre de sesión */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-green-700">
          <button 
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center text-sm"
          >
            <FaSignOutAlt className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Contenido principal con el gradiente específico */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaShip className="text-green-700 mr-2" />
              {selectedSede ? `Ventas - ${selectedSede.nombre}` : 'Ventas'}
            </h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>
        
        {/* Contenido principal (renderizado por las rutas) */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendedorLayout;