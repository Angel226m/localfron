 
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchUsuarioPorId, deleteUsuario, clearUsuarioSeleccionado } from '../../../store/slices/usuarioSlice';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { fetchUserSedes } from '../../../store/slices/authSlice';

const UsuarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { usuarioSeleccionado, loading, error } = useSelector((state: RootState) => state.usuario);
  const { availableSedes } = useSelector((state: RootState) => state.auth);
  
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUsuarioPorId(parseInt(id)));
      dispatch(fetchUserSedes());
    }
    
    return () => {
      dispatch(clearUsuarioSeleccionado());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteUsuario(parseInt(id))).unwrap();
        navigate('/admin/usuarios');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  // Obtener nombre de sede
  const getNombreSede = (id_sede: number | null) => {
    if (!id_sede) return 'Sin sede asignada';
    const sede = availableSedes.find(sede => sede.id_sede === id_sede);
    return sede ? sede.nombre : `Sede ${id_sede}`;
  };

  // Formatear fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
        <Link to="/admin/usuarios" className="mt-2 inline-block text-red-700 underline">
          Volver a la lista de usuarios
        </Link>
      </div>
    );
  }

  if (!usuarioSeleccionado) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p>No se encontró el usuario solicitado.</p>
        <Link to="/admin/usuarios" className="mt-2 inline-block text-yellow-700 underline">
          Volver a la lista de usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link 
            to="/admin/usuarios" 
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold">Detalle de Usuario</h2>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/admin/usuarios/${id}/editar`}
            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            <FiEdit className="mr-2" />
            Editar
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FiTrash2 className="mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información Personal</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Nombre Completo</div>
              <div className="text-base">
                {usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Tipo de Documento</div>
              <div className="text-base">{usuarioSeleccionado.tipo_documento}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Número de Documento</div>
              <div className="text-base">{usuarioSeleccionado.numero_documento}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Fecha de Nacimiento</div>
              <div className="text-base">{formatDate(usuarioSeleccionado.fecha_nacimiento)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Nacionalidad</div>
              <div className="text-base">{usuarioSeleccionado.nacionalidad || 'No especificada'}</div>
            </div>
          </div>
        </div>
        
        {/* Información de Contacto */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información de Contacto</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Correo Electrónico</div>
              <div className="text-base">{usuarioSeleccionado.correo}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Teléfono</div>
              <div className="text-base">{usuarioSeleccionado.telefono || 'No especificado'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Dirección</div>
              <div className="text-base">{usuarioSeleccionado.direccion || 'No especificada'}</div>
            </div>
          </div>
        </div>
        
        {/* Información Laboral */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información del Sistema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500">Rol</div>
              <div className="text-base">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  usuarioSeleccionado.rol === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : usuarioSeleccionado.rol === 'VENDEDOR' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                }`}>
                  {usuarioSeleccionado.rol === 'ADMIN' 
                    ? 'Administrador' 
                    : usuarioSeleccionado.rol === 'VENDEDOR' 
                      ? 'Vendedor' 
                      : 'Chofer'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Sede Asignada</div>
              <div className="text-base">
                {usuarioSeleccionado.id_sede 
                  ? getNombreSede(usuarioSeleccionado.id_sede)
                  : <span className="text-gray-400 italic">Sin sede asignada</span>}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Fecha de Registro</div>
              <div className="text-base">
                {formatDate(usuarioSeleccionado.fecha_registro)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Está seguro de que desea eliminar al usuario <span className="font-semibold">{usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}</span>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioDetail;