import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserSedes, selectSede } from '../../../infrastructure/store/slices/authSlice';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { BsBuilding, BsCheckCircleFill, BsSearch } from 'react-icons/bs';
import { FaCity, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from "framer-motion";

// Define la interfaz para una sede
interface Sede {
  id_sede: number;
  nombre: string;
  ciudad: string;
  direccion?: string; // Marcado como opcional con ?
  telefono?: string;
  correo?: string;
  provincia?: string;
  pais?: string;
  eliminado?: boolean;
}

const SelectSedePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, availableSedes, isLoading, selectedSede, isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredSede, setHoveredSede] = useState<number | null>(null);

  // Filtrar sedes según término de búsqueda con comprobación de valores undefined
  const filteredSedes = availableSedes.filter(sede => 
    sede.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sede.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sede.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  // Cargar sedes al montar el componente
  useEffect(() => {
    if (isAuthenticated && user?.rol === 'ADMIN') {
      dispatch(fetchUserSedes());
    } else if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Si no es admin o ya tiene sede seleccionada, redireccionar
      navigate('/');
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  // Si ya hay una sede seleccionada, redirigir al dashboard
  useEffect(() => {
    if (selectedSede) {
      navigate('/admin/dashboard');
    }
  }, [selectedSede, navigate]);

  const handleSelectSede = async (id_sede: number) => {
    try {
      await dispatch(selectSede(id_sede));
      // Mostrar animación de éxito antes de navegar
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 800);
    } catch (error) {
      console.error('Error al seleccionar sede:', error);
    }
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg text-blue-800 font-medium animate-pulse">Cargando sedes disponibles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Seleccione una Sede
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Elija una sede para administrar y gestionar sus operaciones
          </motion.p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </motion.div>
        )}
        
        {/* Barra de búsqueda */}
        {availableSedes.length > 0 && (
          <motion.div 
            className="mb-8 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Buscar por nombre, ciudad o dirección..."
              />
            </div>
          </motion.div>
        )}
        
        {/* Grid de Sedes */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredSedes.map((sede) => (
            <motion.div 
              key={sede.id_sede}
              variants={childVariants}
              onMouseEnter={() => setHoveredSede(sede.id_sede)}
              onMouseLeave={() => setHoveredSede(null)}
              className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 ${
                hoveredSede === sede.id_sede ? 'scale-105 shadow-lg' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-blue-100 p-3 mr-3">
                    <BsBuilding className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{sede.nombre || 'Sin nombre'}</h2>
                </div>
                
                <div className="mb-4 space-y-2">
                  <div className="flex items-start">
                    <FaCity className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                    <span className="text-gray-700">{sede.ciudad || 'Ciudad no especificada'}</span>
                  </div>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                    <span className="text-gray-600 text-sm">{sede.direccion || 'Dirección no especificada'}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSelectSede(sede.id_sede)}
                  className="mt-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] flex justify-center items-center"
                >
                  <BsCheckCircleFill className="mr-2" /> Seleccionar esta sede
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {availableSedes.length === 0 && !isLoading && (
          <motion.div 
            className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-6 rounded-md shadow-md max-w-3xl mx-auto mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold">No hay sedes disponibles</p>
                <p className="text-sm mt-1">No se encontraron sedes asignadas a su cuenta. Por favor contacte al administrador del sistema.</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Indicador de cantidad de sedes encontradas */}
        {availableSedes.length > 0 && (
          <motion.div 
            className="text-center mt-8 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Se {filteredSedes.length === 1 ? 'encontró' : 'encontraron'} {filteredSedes.length} {filteredSedes.length === 1 ? 'sede' : 'sedes'} {searchTerm && 'para la búsqueda actual'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SelectSedePage;