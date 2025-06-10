import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Card from '../components/Card';
import Button from '../components/Button';
import { FaShip, FaClock, FaUserFriends, FaMoneyBillWave, FaCalendarAlt, FaSearch } from 'react-icons/fa';

interface Tour {
  id: number;
  nombre: string;
  descripcion: string;
  horarios: string[];
  duracion: string;
  capacidad: number;
  disponibles: number;
  precio: string;
  imagen: string;
}

const ToursDisponiblesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo
        setTimeout(() => {
          setTours([
            { 
              id: 1, 
              nombre: 'Tour Islas Ballestas', 
              descripcion: 'Explora las impresionantes islas y observa la diversa fauna marina.',
              horarios: ['08:00', '10:30', '13:00'],
              duracion: '2.5 horas',
              capacidad: 25,
              disponibles: 12,
              precio: 'S/ 50.00',
              imagen: 'https://images.unsplash.com/photo-1583030225577-329fe6cc80fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            { 
              id: 2, 
              nombre: 'Tour Reserva de Paracas', 
              descripcion: 'Visita la reserva nacional y disfruta de sus paisajes desérticos y marinos.',
              horarios: ['09:00', '14:00'],
              duracion: '3 horas',
              capacidad: 20,
              disponibles: 8,
              precio: 'S/ 60.00',
              imagen: 'https://images.unsplash.com/photo-1596402184320-417e7a2a89c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            { 
              id: 3, 
              nombre: 'Tour Viñedos de Ica', 
              descripcion: 'Recorre los viñedos y bodegas más tradicionales de la región.',
              horarios: ['09:30', '11:00'],
              duracion: '4 horas',
              capacidad: 15,
              disponibles: 6,
              precio: 'S/ 70.00',
              imagen: 'https://images.unsplash.com/photo-1559944132-3ef713878729?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ]);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error al cargar tours:', error);
        setLoading(false);
      }
    };
    
    fetchTours();
  }, [dispatch, selectedSede, selectedDate]);
  
  const handleCreateReserva = (tour: Tour, horario: string) => {
    console.log('Crear reserva para:', tour, 'Horario:', horario);
    // Aquí redirigirías al formulario de reserva
  };
  
  const filteredTours = tours.filter(tour => 
    tour.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tours Disponibles</h1>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar tour..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {/* Lista de tours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">
            <p className="text-gray-500">Cargando tours disponibles...</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="col-span-full p-8 text-center">
            <p className="text-gray-500">No se encontraron tours disponibles</p>
          </div>
        ) : (
          filteredTours.map(tour => (
            <Card key={tour.id} className="border overflow-hidden bg-white hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={tour.imagen} 
                  alt={tour.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{tour.nombre}</h3>
                <p className="text-gray-600 text-sm mt-1">{tour.descripcion}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <FaClock className="mr-1" /> {tour.duracion}
                    </span>
                    <span className="flex items-center text-gray-600">
                      <FaUserFriends className="mr-1" /> {tour.disponibles} disp. / {tour.capacidad}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-gray-800 font-semibold">
                      <FaMoneyBillWave className="mr-1 text-green-600" /> {tour.precio}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs text-gray-500 mb-2">Horarios disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {tour.horarios.map((horario, idx) => (
                      <Button 
                        key={idx}
                        className="text-xs py-1 px-3"
                        variant="primary"
                        size="sm"
                        onClick={() => handleCreateReserva(tour, horario)}
                      >
                        {horario} - Reservar
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ToursDisponiblesPage;