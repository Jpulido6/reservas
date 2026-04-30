export const API_ENDPOINTS = {
  // Auth
  AUTH_CONTEXTOS: '/v1/auth/contextos',
  AUTH_FETCH_ENTERPRISES: '/v1/auth/usuarios/fetch-enterprises',
  AUTH_LOGIN_USUARIO: '/v1/auth/usuarios/login',
  AUTH_LOGIN_CLIENTE: '/v1/auth/clientes/login',
  AUTH_LOGOUT: '/v1/auth/logout',
  AUTH_DATA: '/v1/auth/data',

  // Reservas
  RESERVAS_LIST: '/v1/reservas',
  RESERVAS_FETCH_SERVICIOS: '/v1/reservas/fetch-servicios',
  RESERVAS_FETCH_RECURSOS: '/v1/reservas/fetch-recursos',
  RESERVAS_FETCH_DISPONIBILIDAD: '/v1/reservas/fetch-disponibilidad',
  RESERVAS_CREAR: '/v1/reservas/reservar-recurso',
  RESERVAS_REALIZAR_PAGO: '/v1/reservas/realizar-pago',
  RESERVAS_VERIFICAR_PAGO: '/v1/reservas/verificar-pago',

  // Usuarios
  USUARIOS: '/v1/seguridad/usuarios',
  USUARIOS_ESTADOS: '/v1/seguridad/usuarios/estados/suggestions',
  USUARIOS_RESET_PASSWORD: '/v1/seguridad/usuarios/reset-password',

  // Roles y Permisos
  ROLES: '/v1/seguridad/roles',
  MODULOS: '/v1/seguridad/modulos',
  SUB_MODULOS: '/v1/seguridad/sub-modulos',
  PERMISOS: '/v1/seguridad/permisos',
};