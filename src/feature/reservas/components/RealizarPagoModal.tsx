import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useRealizarPago } from '../hooks/useReservas';
import type { Reserva } from '../api/reservas.api';

export const RealizarPagoModal = ({ isOpen, onClose, reserva }: { isOpen: boolean, onClose: () => void, reserva: Reserva | null }) => {
  const [comprobante, setComprobante] = useState('');
  const realizarPagoMutation = useRealizarPago();

  const handleRegister = () => {
    if (!reserva) return;
    realizarPagoMutation.mutate({
      reservaId: reserva.id,
      pagoId: reserva.pagos?.[0]?.id || 0,
      comprobanteFileName: comprobante
    }, {
      onSuccess: () => {
        onClose();
        setComprobante('');
      }
    });
  };

  if (!reserva) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <div className="space-y-4 py-4">
        <p className="text-sm text-secondary">
          Registrando pago para la reserva de <span className="font-semibold text-primary">{reserva.cliente?.nombre}</span>.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium">Archivo del comprobante</label>
          <Input
            placeholder="Ej. comprobante_123.pdf"
            value={comprobante}
            onChange={(e) => setComprobante(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={onClose} disabled={realizarPagoMutation.isPending}>
          Cancelar
        </Button>
        <Button onClick={handleRegister} disabled={!comprobante || realizarPagoMutation.isPending}>
          {realizarPagoMutation.isPending ? 'Registrando...' : 'Registrar Pago'}
        </Button>
      </div>
    </Modal>
  );
};
