import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { FaUserPlus, FaSearch, FaEye, FaEdit, FaHistory } from 'react-icons/fa';

interface Cliente {
  id: number;
  nombre: string;
  documento: string;
  num_documento: string;
  email: string;
  telefono: string;
  reservas: number;
}

const ClientesVendedorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo
        setTimeout(() => {
          setClientes([
            { id: 1, nombre: 'Juan Pérez', documento: 'DNI', num_documento: '45678912', email: 'juan@example.com', telefono: '987654321', reservas: 3 },
            { id: 2, nombre: 'María López', documento: 'DNI', num_documento: '35791246', email: 'maria@example.com', telefono: '987123654', reservas: 1 },
            { id: 3, nombre: 'Carlos Rodríguez', documento: 'Pasaporte', num_documento: 'AB123456', email: 'carlos@example.com', telefono: '912345678', reservas: 5 }
          ]);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        setLoading(false);
      }
    };
    
    fetchClientes();
  }, [dispatch]);
  
  const handleCreateCliente = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };
  
  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };
  
  const handleViewCliente = (cliente: Cliente) => {
    // Aquí podrías navegar a una vista detallada o abrir un modal con detalles
    console.log('Ver cliente:', cliente);
  };
  
  const handleViewHistorial = (cliente: Cliente) => {
    // Aquí podrías navegar a un historial de reservas del cliente
    console.log('Ver historial del cliente:', cliente);
  };
  
  const filteredClientes = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.num_documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Documento', accessor: 'documento' },
    { header: 'Número', accessor: 'num_documento' },
    { header: 'Email', accessor: 'email' },
    { header: 'Teléfono', accessor: 'telefono' },
    { 
      header: 'Reservas', 
      accessor: (row: Cliente) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.reservas}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: (row: Cliente) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewCliente(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Ver cliente"
          >
            <FaEye />
          </button>
          <button 
            onClick={() => handleEditCliente(row)}
            className="p-1 text-yellow-600 hover:text-yellow-800"
            title="Editar cliente"
          >
            <FaEdit />
          </button>
          <button 
            onClick={() => handleViewHistorial(row)}
            className="p-1 text-green-600 hover:text-green-800"
            title="Ver historial"
          >
            <FaHistory />
          </button>
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
        <Button 
          onClick={handleCreateCliente}
          className="flex items-center gap-2"
          variant="success"
        >
          <FaUserPlus /> Nuevo Cliente
        </Button>
      </div>
      
      {/* Búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, documento o email..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando clientes...</p>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron clientes</p>
          </div>
        ) : (
          <Table 
            columns={columns}
            data={filteredClientes}
          />
        )}
      </div>
      
      {/* Modal para crear/editar cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCliente ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <div className="p-4">
          <form className="space-y-4">
            {/* Aquí irían los campos del formulario de cliente */}
            <p className="text-gray-500">Formulario de cliente aquí...</p>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                onClick={() => setIsModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button 
                variant="success"
              >
                {selectedCliente ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ClientesVendedorPage;