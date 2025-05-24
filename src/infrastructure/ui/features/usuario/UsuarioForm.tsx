 
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  createUsuario, 
  updateUsuario, 
  fetchUsuarioPorId, 
  clearUsuarioError 
} from '../../../store/slices/usuarioSlice';
import { fetchUserSedes } from '../../../store/slices/authSlice';
import { NuevoUsuarioRequest, ActualizarUsuarioRequest } from '../../../../domain/entities/Usuario';

const UsuarioForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { usuarioSeleccionado, loading, error } = useSelector((state: RootState) => state.usuario);
  const { availableSedes, selectedSede } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<NuevoUsuarioRequest>({
    id_sede: selectedSede?.id_sede || null,
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    rol: 'VENDEDOR',
    nacionalidad: '',
    tipo_documento: 'DNI',
    numero_documento: '',
    contrasena: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    dispatch(fetchUserSedes());

    if (isEditing) {
      dispatch(fetchUsuarioPorId(parseInt(id)));
    }

    return () => {
      dispatch(clearUsuarioError());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && usuarioSeleccionado) {
      setFormData({
        id_sede: usuarioSeleccionado.id_sede,
        nombres: usuarioSeleccionado.nombres,
        apellidos: usuarioSeleccionado.apellidos,
        correo: usuarioSeleccionado.correo,
        telefono: usuarioSeleccionado.telefono || '',
        direccion: usuarioSeleccionado.direccion || '',
        fecha_nacimiento: usuarioSeleccionado.fecha_nacimiento ? 
          new Date(usuarioSeleccionado.fecha_nacimiento).toISOString().split('T')[0] : '',
        rol: usuarioSeleccionado.rol,
        nacionalidad: usuarioSeleccionado.nacionalidad || '',
        tipo_documento: usuarioSeleccionado.tipo_documento,
        numero_documento: usuarioSeleccionado.numero_documento,
        contrasena: '',  // No mostrar contraseña en edición
      });
    }
  }, [isEditing, usuarioSeleccionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar errores de contraseña cuando se modifica
    if (name === 'contrasena' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
  };

  const validateForm = () => {
    // Validación básica
    if (!formData.nombres || !formData.apellidos || !formData.correo) {
      return false;
    }

    // Validación de contraseña solo para creación
    if (!isEditing) {
      if (!formData.contrasena) {
        setPasswordError('La contraseña es obligatoria.');
        return false;
      }
      
      if (formData.contrasena.length < 8) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres.');
        return false;
      }
      
      if (formData.contrasena !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        // En edición, omitir la contraseña si está vacía
        const updateData: ActualizarUsuarioRequest = { ...formData };
        if (!updateData.contrasena) {
          delete updateData.contrasena;
        }

        await dispatch(updateUsuario({ id: parseInt(id), usuario: updateData })).unwrap();
      } else {
        await dispatch(createUsuario(formData)).unwrap();
      }
      
      navigate('/admin/usuarios');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
    }
  };

  if (loading && isEditing) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos personales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Datos Personales</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento *
              </label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="CE">Carnet de Extranjería</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad
              </label>
              <input
                type="text"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Datos de contacto y rol */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Datos de Contacto y Rol</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="ADMIN">Administrador</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="CHOFER">Chofer</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede *
              </label>
              <select
                name="id_sede"
                value={formData.id_sede === null ? '' : formData.id_sede}
                onChange={handleChange}
                required={formData.rol !== 'ADMIN'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar sede</option>
                {availableSedes.map(sede => (
                  <option key={sede.id_sede} value={sede.id_sede}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
              {formData.rol === 'ADMIN' && (
                <p className="text-sm text-gray-500 mt-1">
                  Los administradores pueden no tener sede asignada
                </p>
              )}
            </div>

            {/* Contraseña - Solo requerida en creación */}
            {(!isEditing || (isEditing && formData.contrasena)) && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing ? 'Nueva Contraseña' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required={!isEditing}
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required={!isEditing && !!formData.contrasena}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}

            {passwordError && (
              <div className="mb-4 text-red-500 text-sm">
                {passwordError}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;