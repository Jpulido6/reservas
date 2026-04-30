import { useState } from 'react';
import { useUsuarios, useResetPassword } from '../hooks/useUsuarios';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Search, Plus, Edit2, KeyRound } from 'lucide-react';
import { UsuarioFormModal } from '../components/UsuarioFormModal';
import type { Usuario } from '../api/usuarios.api';

export const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  // use debounce in real app for searchTerm
  const { data: usuarios, isLoading } = useUsuarios({ pattern: searchTerm });
  const resetPasswordMutation = useResetPassword();

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleResetPassword = (usuarioId: string) => {
    if (window.confirm('¿Está seguro que desea resetear la contraseña de este usuario?')) {
      resetPasswordMutation.mutate(usuarioId);
    }
  };

  const getStatusColor = (code: number) => {
    switch (code) {
      case 1: return 'bg-success/10 text-success border-success/20'; // Activo
      case 2: return 'bg-danger/10 text-danger border-danger/20'; // Inactivo
      default: return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gestión de Usuarios</h1>
          <p className="text-secondary">Administra los usuarios y sus accesos</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          Nuevo Usuario
        </Button>
      </div>

      <Card className="border-border flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-surface">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <Input
              placeholder="Buscar por nombre, documento o email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-surface">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="border-b border-border bg-elevated/50">
                  <th className="p-4 font-semibold text-sm text-secondary">Documento</th>
                  <th className="p-4 font-semibold text-sm text-secondary">Nombre Completo</th>
                  <th className="p-4 font-semibold text-sm text-secondary">Rol</th>
                  <th className="p-4 font-semibold text-sm text-secondary">Estado</th>
                  <th className="p-4 font-semibold text-sm text-secondary text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-secondary">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  usuarios?.map((usuario) => (
                    <tr key={usuario.id} className="border-b border-border hover:bg-elevated/30 transition-colors">
                      <td className="p-4 text-sm font-medium">{usuario.documento}</td>
                      <td className="p-4 text-sm">
                        <div>{usuario.nombreCompleto}</div>
                        {usuario.email && <div className="text-xs text-secondary">{usuario.email}</div>}
                      </td>
                      <td className="p-4 text-sm">{usuario.rol?.nombre}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(usuario.estado?.code)}`}>
                          {usuario.estado?.forHumans}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-right space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-secondary hover:text-accent"
                          onClick={() => handleEdit(usuario)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-secondary hover:text-danger"
                          onClick={() => handleResetPassword(usuario.id)}
                          title="Resetear Contraseña"
                        >
                          <KeyRound size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <UsuarioFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        usuarioToEdit={selectedUsuario}
      />
    </div>
  );
};
