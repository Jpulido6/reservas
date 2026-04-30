import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Calendar, CheckCircle, Clock, CreditCard, Users, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useReservas } from '../reservas/hooks/useReservas';

export const DashboardPage = () => {
  const navigate = useNavigate();

  // Get today's start and end date strings for query
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();

  const { data: reservas, isLoading } = useReservas({ start: startOfDay, end: endOfDay });

  // Calculate metrics based on actual data
  const reservasHoy = reservas?.length || 0;
  // Fallback to mock logic if there's no data for now, just to avoid breaking the UI look
  const pendientesPago = reservas?.filter(r => !r.pagos || r.pagos.length === 0).length || 0;
  const verificadas = reservas?.filter(r => r.pagos?.some(p => p.isAprobado)).length || 0;
  const nuevosClientes = 0; // Requires a different endpoint or logic

  const metrics = [
    { label: 'Reservas Hoy', value: isLoading ? '...' : reservasHoy.toString(), icon: Calendar, color: 'text-accent', bgColor: 'bg-accent/10' },
    { label: 'Pendientes Pago', value: isLoading ? '...' : pendientesPago.toString(), icon: Clock, color: 'text-warning', bgColor: 'bg-warning/10' },
    { label: 'Verificadas', value: isLoading ? '...' : verificadas.toString(), icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    { label: 'Nuevos Clientes', value: isLoading ? '...' : nuevosClientes.toString(), icon: Users, color: 'text-accent', bgColor: 'bg-accent/10' },
  ];

  const quickActions = [
    { label: 'Nueva Reserva', icon: PlusCircle, action: () => navigate('/reservas/nueva') },
    { label: 'Registrar Pago', icon: CreditCard, action: () => navigate('/reservas') },
    { label: 'Ver Calendario', icon: Calendar, action: () => navigate('/reservas') },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary">Resumen de la actividad de hoy</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => (
          <Card key={idx} className="border-border">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">{item.label}</p>
                <p className="text-3xl font-bold text-primary mt-2">{item.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${item.bgColor}`}>
                <item.icon className={item.color} size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-border">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full justify-start h-12"
                onClick={action.action}
              >
                <action.icon className="mr-3 h-5 w-5" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chart placeholder */}
        <Card className="lg:col-span-2 border-border flex flex-col">
          <CardHeader>
            <CardTitle>Ocupación últimos 7 días</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[200px] flex items-center justify-center bg-elevated/30 rounded-md mx-6 mb-6 border border-dashed border-border">
            <div className="text-center text-secondary">
              <Calendar className="mx-auto h-10 w-10 mb-2 opacity-20" />
              <p>El gráfico de ocupación se implementará aquí</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
