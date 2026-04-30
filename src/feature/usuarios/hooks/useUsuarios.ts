import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuarios.api';
import toast from 'react-hot-toast';

export const useUsuarios = (params?: { pattern?: string, isUpdatingUsers?: boolean }) => {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuariosApi.getUsuarios(params),
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: usuariosApi.getRoles,
  });
};

export const useEstadosUsuario = () => {
  return useQuery({
    queryKey: ['estados-usuario'],
    queryFn: usuariosApi.getEstados,
  });
};

export const useCrearUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usuariosApi.crearUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear el usuario');
    }
  });
};

export const useActualizarUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usuariosApi.actualizarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el usuario');
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: usuariosApi.resetPassword,
    onSuccess: () => {
      toast.success('Contraseña reseteada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al resetear la contraseña');
    }
  });
};
