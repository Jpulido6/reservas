import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useVerificarPago } from '../hooks/useReservas';
import type { Reserva } from '../api/reservas.api';

export const VerificarPagoModal = ({ isOpen, onClose, reserva }: { isOpen: boolean, onClose: () => void, reserva: Reserva | null }) => {
  const [observaciones, setObservaciones] = useState('');
  const verificarPagoMutation = useVerificarPago();

  const handleVerify = (isAprobado: boolean) => {
    if (!reserva) return;
    verificarPagoMutation.mutate({
      reservaId: reserva.id,
      pagoId: reserva.pagos?.[0]?.id || 0,
      isAprobado,
      observaciones
    }, {
      onSuccess: () => {
        onClose();
        setObservaciones('');
      }
    });
  };

  if (!reserva) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verificar Pago">
      <div className="space-y-4 py-4">
        <p className="text-sm text-secondary">
          Verificando pago de la reserva de <span className="font-semibold text-primary">{reserva.cliente?.nombre}</span>.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium">Observaciones (Opcional)</label>
          <Input
            placeholder="Ej. Pago verificado en cuenta..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={() => handleVerify(false)} disabled={verificarPagoMutation.isPending} className="text-danger border-danger hover:text-white hover:bg-danger">
          Rechazar
        </Button>
        <Button onClick={() => handleVerify(true)} disabled={verificarPagoMutation.isPending} className="bg-success text-white hover:bg-success/90">
          {verificarPagoMutation.isPending ? 'Procesando...' : 'Aprobar Pago'}
        </Button>
      </div>
    </Modal>
  );
};
