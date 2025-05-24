 
export interface Usuario {
  id_usuario: number;
  id_sede: number | null;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CHOFER' ;
  nacionalidad?: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_registro?: string;
  eliminado?: boolean;
}

export interface NuevoUsuarioRequest {
  id_sede?: number | null;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CHOFER' ;
  nacionalidad?: string;
  tipo_documento: string;
  numero_documento: string;
  contrasena: string;
}

export interface UsuarioActualizacionRequest {
  id_sede?: number | null;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  rol?: 'ADMIN' | 'VENDEDOR' | 'CHOFER'  ;
  nacionalidad?: string;
  tipo_documento?: string;
  numero_documento?: string;
}