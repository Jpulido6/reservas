import { useState, useEffect } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useCrearUsuario, useActualizarUsuario, useRoles, useEstadosUsuario } from '../hooks/useUsuarios';
import type { Usuario } from '../api/usuarios.api';

export const UsuarioFormModal = ({ isOpen, onClose, usuarioToEdit }: { isOpen: boolean, onClose: () => void, usuarioToEdit?: Usuario | null }) => {
  const [formData, setFormData] = useState({
    documento: '',
    tipoDocumentoCode: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    numeroCelular: '',
    rolId: '',
    estadoCode: ''
  });

  const { data: roles } = useRoles();
  const { data: estados } = useEstadosUsuario();

  const crearUsuarioMutation = useCrearUsuario();
  const actualizarUsuarioMutation = useActualizarUsuario();

  useEffect(() => {
    if (usuarioToEdit) {
      setFormData({
        documento: usuarioToEdit.documento || '',
        tipoDocumentoCode: usuarioToEdit.tipoDocumento?.code?.toString() || '',
        primerNombre: usuarioToEdit.primerNombre || '',
        segundoNombre: usuarioToEdit.segundoNombre || '',
        primerApellido: usuarioToEdit.primerApellido || '',
        segundoApellido: usuarioToEdit.segundoApellido || '',
        email: usuarioToEdit.email || '',
        numeroCelular: usuarioToEdit.numeroCelular || '',
        rolId: usuarioToEdit.rol?.id || '',
        estadoCode: usuarioToEdit.estado?.code?.toString() || ''
      });
    } else {
      setFormData({
        documento: '',
        tipoDocumentoCode: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        email: '',
        numeroCelular: '',
        rolId: '',
        estadoCode: ''
      });
    }
  }, [usuarioToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tipoDocumentoCode: Number(formData.tipoDocumentoCode),
      estadoCode: Number(formData.estadoCode),
    };

    if (usuarioToEdit) {
      actualizarUsuarioMutation.mutate({ id: usuarioToEdit.id, payload }, {
        onSuccess: () => onClose()
      });
    } else {
      crearUsuarioMutation.mutate(payload, {
        onSuccess: () => onClose()
      });
    }
  };

  const isPending = crearUsuarioMutation.isPending || actualizarUsuarioMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={usuarioToEdit ? 'Editar Usuario' : 'Crear Usuario'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo Documento</label>
            <select
              required
              className="w-full bg-surface border border-border rounded-md px-3 py-2 outline-none focus:border-accent"
              value={formData.tipoDocumentoCode}
              onChange={(e) => setFormData({ ...formData, tipoDocumentoCode: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {/* Assuming these are the standard types, ideally should come from backend */}
              <option value="1">Cédula de Ciudadanía</option>
              <option value="2">Tarjeta de Identidad</option>
              <option value="3">Cédula de Extranjería</option>
              <option value="4">Pasaporte</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Documento</label>
            <Input
              required
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Primer Nombre</label>
            <Input
              required
              value={formData.primerNombre}
              onChange={(e) => setFormData({ ...formData, primerNombre: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Segundo Nombre (Opcional)</label>
            <Input
              value={formData.segundoNombre}
              onChange={(e) => setFormData({ ...formData, segundoNombre: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Primer Apellido</label>
            <Input
              required
              value={formData.primerApellido}
              onChange={(e) => setFormData({ ...formData, primerApellido: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Segundo Apellido (Opcional)</label>
            <Input
              value={formData.segundoApellido}
              onChange={(e) => setFormData({ ...formData, segundoApellido: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email (Opcional)</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Celular (Opcional)</label>
            <Input
              value={formData.numeroCelular}
              onChange={(e) => setFormData({ ...formData, numeroCelular: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rol</label>
            <select
              required
              className="w-full bg-surface border border-border rounded-md px-3 py-2 outline-none focus:border-accent"
              value={formData.rolId}
              onChange={(e) => setFormData({ ...formData, rolId: e.target.value })}
            >
              <option value="">Seleccione un rol...</option>
              {roles?.map((r: any) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <select
              required
              className="w-full bg-surface border border-border rounded-md px-3 py-2 outline-none focus:border-accent"
              value={formData.estadoCode}
              onChange={(e) => setFormData({ ...formData, estadoCode: e.target.value })}
            >
              <option value="">Seleccione un estado...</option>
              {estados?.map((est: any) => (
                <option key={est.code} value={est.code.toString()}>{est.forHumans}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="bg-accent text-white hover:bg-accent/90">
            {isPending ? 'Guardando...' : 'Guardar Usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
