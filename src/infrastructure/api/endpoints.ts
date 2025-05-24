export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    status: '/auth/status',       // Necesitarás implementar este endpoint
    userSedes: '/auth/sedes',     // Necesitarás implementar este endpoint
    selectSede: '/auth/select-sede', // Necesitarás implementar este endpoint
  },
  sede: {
    base: '/sedes',
    byId: (id: number) => `/sedes/${id}`,
  },
  usuario: {
    base: '/admin/usuarios',
    byId: (id: number) => `/admin/usuarios/${id}`,
    byRol: (rol: string) => `/admin/usuarios/rol/${rol}`,
  },
  // ... otros endpoints
};