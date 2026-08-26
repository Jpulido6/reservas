import { useState } from 'react';
import { useReservas, useServicios } from '../hooks/useReservas';
import { Card, CardContent } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router';
import { RealizarPagoModal } from '../components/RealizarPagoModal';
import { VerificarPagoModal } from '../components/VerificarPagoModal';
import type { Reserva } from '../api/reservas.api';

export const ReservasPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to format date for API with Colombia timezone (-05:00)
  const getStartOfDay = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00-05:00`;
  };
  const getEndOfDay = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T23:59:59.999-05:00`;
  };

  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [servicioFilter, setServicioFilter] = useState<string>('');

  const [realizarPagoReserva, setRealizarPagoReserva] = useState<Reserva | null>(null);
  const [verificarPagoReserva, setVerificarPagoReserva] = useState<Reserva | null>(null);

  const { data: reservas, isLoading } = useReservas({
    start: getStartOfDay(currentDate),
    end: getEndOfDay(currentDate),
  });

  const { data: servicios } = useServicios();

  const nextDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  const prevDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  const today = () => setCurrentDate(new Date());

  const getStatusColor = (code: number) => {
    // Mock colors based on code, you can adapt based on real backend codes
    switch (code) {
      case 1: return 'bg-success/10 text-success border-success/20'; // Confirmada
      case 2: return 'bg-warning/10 text-warning border-warning/20'; // Pendiente
      case 3: return 'bg-danger/10 text-danger border-danger/20'; // Cancelada
      default: return 'bg-accent/10 text-accent border-accent/20';
    }
  };

  const filteredReservas = reservas?.filter((r) => {
    if (estadoFilter && r.estado.code.toString() !== estadoFilter) return false;
    if (servicioFilter && r.servicio.id.toString() !== servicioFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Calendario de Reservas</h1>
          <p className="text-secondary">Gestiona las citas y recursos</p>
        </div>
        <Button onClick={() => navigate('/reservas/nueva')} className="gap-2">
          <Plus size={18} />
          Nueva Reserva
        </Button>
      </div>

      <Card className="border-border flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-elevated/30">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevDay}>
              <ChevronLeft size={18} />
            </Button>
            <Button variant="outline" onClick={today}>Hoy</Button>
            <Button variant="outline" size="icon" onClick={nextDay}>
              <ChevronRight size={18} />
            </Button>
            <h2 className="text-lg font-semibold ml-4 capitalize flex items-center gap-2">
              <CalendarIcon size={20} className="text-accent" />
              {currentDate.toLocaleDateString('es-ES', { timeZone: 'America/Bogota', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border bg-surface flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-secondary font-medium">
            <Filter size={16} /> Filtros:
          </div>
          <select
            className="text-sm bg-elevated border border-border rounded-md px-3 py-1.5 outline-none focus:border-accent"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="1">Confirmada</option>
            <option value="2">Pendiente</option>
            <option value="3">Cancelada</option>
          </select>

          <select
            className="text-sm bg-elevated border border-border rounded-md px-3 py-1.5 outline-none focus:border-accent"
            value={servicioFilter}
            onChange={(e) => setServicioFilter(e.target.value)}
          >
            <option value="">Todos los servicios</option>
            {servicios?.map(s => (
              <option key={s.id} value={s.id.toString()}>{s.nombre}</option>
            ))}
          </select>
        </div>

        {/* Calendar View (Daily list) */}
        <div className="flex-1 overflow-auto p-4 bg-surface">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : filteredReservas?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-secondary">
              <CalendarIcon size={48} className="opacity-20 mb-4" />
              <p>No hay reservas que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservas?.map((reserva) => (
                <Card key={reserva.id} className={`border ${getStatusColor(reserva.estado.code)}`}>
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">
                          {new Date(reserva.fechaInicio).toLocaleTimeString('es-ES', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' })} -
                          {new Date(reserva.fechaFin).toLocaleTimeString('es-ES', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(reserva.estado.code)}`}>
                          {reserva.estado.forHumans}
                        </span>
                      </div>
                      <h3 className="font-semibold">{reserva.servicio.nombre}</h3>
                      {/* <p className="text-sm opacity-80">Cliente: {reserva.cliente.nombre ?? 'N/A'} ({reserva.cliente.documento})</p> */}
                      <p className="text-sm opacity-80 flex items-center gap-1 mt-1">
                        Recurso: <span className="font-medium">{reserva.recurso.nombre}</span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <Button variant="outline" size="sm" className="bg-surface">
                        Ver Detalles
                      </Button>
                      {!reserva.pagos?.some(p => p.isAprobado) && (
                        reserva.pagos?.some(p => !p.isAprobado) ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-warning text-white hover:bg-warning/90"
                            onClick={() => setVerificarPagoReserva(reserva)}
                          >
                            Verificar Pago
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-accent text-white hover:bg-accent/90"
                            onClick={() => setRealizarPagoReserva(reserva)}
                          >
                            Registrar Pago
                          </Button>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      <RealizarPagoModal
        isOpen={!!realizarPagoReserva}
        onClose={() => setRealizarPagoReserva(null)}
        reserva={realizarPagoReserva}
      />
      <VerificarPagoModal
        isOpen={!!verificarPagoReserva}
        onClose={() => setVerificarPagoReserva(null)}
        reserva={verificarPagoReserva}
      />
    </div>
  );
};
