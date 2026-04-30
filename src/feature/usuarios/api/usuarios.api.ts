import { axiosClient } from '../../../core/api/axios-client';
import { API_ENDPOINTS } from '../../../core/api/endpoint';

export interface CtmType { code: number; forHumans: string; abbreviation?: string; }
export interface Rol { id: string; nombre: string; }

export interface Usuario {
  id: string; 
  documento: string; 
  nombreCompleto: string;
  primerNombre: string; 
  segundoNombre?: string;
  primerApellido: string; 
  segundoApellido?: string;
  email?: string; 
  numeroCelular?: string;
  rol: Rol;
  estado: CtmType; 
  tipoDocumento: CtmType;
}

export const usuariosApi = {
  getUsuarios: async (params?: { pattern?: string, isUpdatingUsers?: boolean }): Promise<Usuario[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.USUARIOS, { params });
    return response.data;
  },

  crearUsuario: async (data: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.USUARIOS, data);
    return response.data;
  },

  actualizarUsuario: async (data: { id: string, payload: any }) => {
    const response = await axiosClient.put(`${API_ENDPOINTS.USUARIOS}/${data.id}`, data.payload);
    return response.data;
  },

  getEstados: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USUARIOS_ESTADOS);
    return response.data;
  },

  resetPassword: async (usuarioId: string) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.USUARIOS_RESET_PASSWORD}/${usuarioId}`);
    return response.data;
  },

  getRoles: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.ROLES);
    return response.data;
  }
};
