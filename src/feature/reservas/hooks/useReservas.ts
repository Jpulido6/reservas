import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservasApi } from '../api/reservas.api';
import toast from 'react-hot-toast';

export const useReservas = (params?: { start?: string, end?: string }) => {
  return useQuery({
    queryKey: ['reservas', params],
    queryFn: () => reservasApi.getReservas(params),
  });
};

export const useServicios = () => {
  return useQuery({
    queryKey: ['servicios'],
    queryFn: reservasApi.getServicios,
  });
};

export const useRecursos = () => {
  return useQuery({
    queryKey: ['recursos'],
    queryFn: reservasApi.getRecursos,
  });
};

export const useDisponibilidad = (params: { recursoId: number, servicioId: number, fecha: string }, enabled: boolean) => {
  return useQuery({
    queryKey: ['disponibilidad', params],
    queryFn: () => reservasApi.getDisponibilidad(params),
    enabled, // Only fetch when enabled (e.g., when all params are selected)
  });
};

export const useCrearReserva = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reservasApi.crearReserva,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Reserva creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear la reserva');
    }
  });
};

export const useRealizarPago = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reservasApi.realizarPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Pago registrado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al registrar el pago');
    }
  });
};

export const useVerificarPago = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reservasApi.verificarPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Pago verificado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al verificar el pago');
    }
  });
};
