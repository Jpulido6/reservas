import { axiosClient } from '../../../core/api/axios-client';
import { API_ENDPOINTS } from '../../../core/api/endpoint';

// Types can be moved to a shared interfaces file later
export interface CtmType { code: number; forHumans: string; abbreviation?: string; }
export interface Servicio { id: number; nombre: string; descripcion: string; duracionInMinutes: number; costo: number; }
export interface Recurso { id: number; nombre: string; fileName: string; fileNames: string[]; }
export interface Cliente { id: string; documento: string; nombre: string; email?: string; numeroCelular?: string; }
export interface Pago { id: number; isAprobado: boolean; observaciones?: string; }
export interface Reserva {
  id: number; fechaInicio: string; fechaFin: string;
  estado: CtmType; servicio: Servicio;
  cliente: Cliente; recurso: Recurso; pagos: Pago[];
}

export const reservasApi = {
  getReservas: async (params?: { start?: string, end?: string }): Promise<Reserva[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.RESERVAS_LIST, { params });
    return response.data;
  },

  getServicios: async (): Promise<Servicio[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.RESERVAS_FETCH_SERVICIOS);
    return response.data;
  },

  getRecursos: async (): Promise<Recurso[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.RESERVAS_FETCH_RECURSOS);
    return response.data;
  },

  getDisponibilidad: async (params: { recursoId: number, servicioId: number, fecha: string }) => {
    const response = await axiosClient.get(API_ENDPOINTS.RESERVAS_FETCH_DISPONIBILIDAD, { params });
    return response.data;
  },

  crearReserva: async (data: {
    recursoId: number,
    servicioId: number,
    start: string,
    end: string,
    nombreCompleto?: string,
    numeroCelular?: string
  }) => {
    const response = await axiosClient.post(API_ENDPOINTS.RESERVAS_CREAR, data);
    return response.data;
  },

  realizarPago: async (data: { reservaId: number, pagoId: number, comprobanteFileName: string }) => {
    const response = await axiosClient.patch(API_ENDPOINTS.RESERVAS_REALIZAR_PAGO, data);
    return response.data;
  },

  verificarPago: async (data: { reservaId: number, pagoId: number, isAprobado: boolean, observaciones?: string }) => {
    const response = await axiosClient.patch(API_ENDPOINTS.RESERVAS_VERIFICAR_PAGO, data);
    return response.data;
  }
};
