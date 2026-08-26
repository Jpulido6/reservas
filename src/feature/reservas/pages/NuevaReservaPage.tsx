import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useServicios, useRecursos, useDisponibilidad, useCrearReserva } from '../hooks/useReservas';
import { Card, CardContent } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { ArrowLeft, ArrowRight, Check, Calendar as CalendarIcon, Clock, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NuevaReservaPage = () => {
  const navigate = useNavigate();

  // New user data state initialized from localStorage
  const [nombreCliente, setNombreCliente] = useState(() => localStorage.getItem('reserva_nombre') || '');
  const [celularCliente, setCelularCliente] = useState(() => localStorage.getItem('reserva_celular') || '');

  const [step, setStep] = useState(() => {
    const savedName = localStorage.getItem('reserva_nombre');
    const savedPhone = localStorage.getItem('reserva_celular');
    return (savedName && savedPhone) ? 2 : 1;
  });

  const [servicioId, setServicioId] = useState<number | null>(null);
  const [recursoId, setRecursoId] = useState<number | null>(null);
  const getColombiaDateString = () => {
    // Returns YYYY-MM-DD in Colombia timezone
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  };

  const [fecha, setFecha] = useState<string>(getColombiaDateString());
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<{ start: string, end: string } | null>(null);

  const { data: servicios, isLoading: loadingServicios } = useServicios();
  const { data: recursos, isLoading: loadingRecursos } = useRecursos();
  const { data: disponibilidad, isLoading: loadingDisponibilidad } = useDisponibilidad(
    { recursoId: recursoId!, servicioId: servicioId!, fecha },
    !!recursoId && !!servicioId && !!fecha && step === 4
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

  const { mutate: crearReserva, isPending: isCreating } = useCrearReserva();

  const handleNext = () => {
    if (step === 1) {
      localStorage.setItem('reserva_nombre', nombreCliente);
      localStorage.setItem('reserva_celular', celularCliente);
    }
    setStep(prev => prev + 1);
  };
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    if (!recursoId || !servicioId || !horarioSeleccionado) return;

    // We add client data to the mutation payload
    // Note: The API might need updating to handle these fields
    crearReserva(
      {
        recursoId,
        servicioId,
        start: horarioSeleccionado.start,
        end: horarioSeleccionado.end,
        nombreCompleto: nombreCliente,
        numeroCelular: celularCliente
      },
      { onSuccess: () => navigate('/reservas') }
    );
  };

  const steps = [
    { num: 1, title: 'Datos' },
    { num: 2, title: 'Servicio' },
    { num: 3, title: 'Recurso' },
    { num: 4, title: 'Horario' },
    { num: 5, title: 'Confirmar' },
  ];

  const stepVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.25, ease: 'easeIn' } },
  } as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/reservas')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Nueva Reserva</h1>
          <p className="text-secondary">Sigue los pasos para agendar</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative mb-8 max-w-2xl mx-auto px-4">
        {/* Background line */}
        <div className="absolute left-4 right-4 top-[18px] h-[2px] bg-border" />
        {/* Progress line */}
        <motion.div
          className="absolute left-4 top-[18px] h-[2px] bg-accent origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (step - 1) / (steps.length - 1) }}
          style={{ right: '1rem', transformOrigin: 'left' }}
          transition={{ duration: 0.4 }}
        />


        <div className="flex items-center justify-between relative">
          {steps.map(s => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: step === s.num ? 1.15 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 bg-surface
                  ${step > s.num ? 'bg-accent border-accent text-white' : ''}
                  ${step === s.num ? 'border-accent text-accent ring-4 ring-accent/20' : ''}
                  ${step < s.num ? 'border-border text-secondary' : ''}
                `}
              >
                {step > s.num ? <Check size={16} /> : s.num}
              </motion.div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-primary' : 'text-secondary'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card with steps */}
      <Card className="border-border shadow-sm min-h-[420px] flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col">
          <AnimatePresence mode="wait">

            {/* STEP 1: Datos Cliente */}
            {step === 1 && (

              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} />
                  </div>
                  <h2 className="text-xl font-bold">Datos del Cliente</h2>
                  <p className="text-sm text-secondary">Ingresa la información de quien realiza la reserva</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-primary flex items-center gap-2">
                      <User size={14} className="text-accent" /> Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Juan Pérez"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-primary flex items-center gap-2">
                      <Phone size={14} className="text-accent" /> Número de Celular
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 300 123 4567"
                      value={celularCliente}
                      onChange={(e) => setCelularCliente(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Servicio */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1"
              >
                <h2 className="text-xl font-semibold mb-4">Selecciona el Servicio</h2>
                {loadingServicios ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {servicios?.map(srv => (
                      <div
                        key={srv.id}
                        onClick={() => setServicioId(srv.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${servicioId === srv.id
                          ? 'border-accent bg-accent/5 shadow-md shadow-accent/10'
                          : 'border-border hover:border-accent/50 hover:bg-elevated/50'
                          }`}
                      >
                        {servicioId === srv.id && (
                          <div className="flex justify-end mb-1">
                            <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </span>
                          </div>
                        )}
                        <h3 className="font-semibold text-lg">{srv.nombre}</h3>
                        <p className="text-sm text-secondary line-clamp-2 mt-1">{srv.descripcion}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm font-medium">
                          <span className="flex items-center gap-1 text-accent">
                            <Clock size={16} /> {srv.duracionInMinutes} min
                          </span>
                          <span className="font-semibold">{formatCurrency(srv.costo)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Recurso */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1"
              >
                <h2 className="text-xl font-semibold mb-4">Selecciona el Recurso</h2>
                {loadingRecursos ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recursos?.map(rec => (
                      <div
                        key={rec.id}
                        onClick={() => setRecursoId(rec.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${recursoId === rec.id
                          ? 'border-accent bg-accent/5 shadow-md shadow-accent/10'
                          : 'border-border hover:border-accent/50 hover:bg-elevated/50'
                          }`}
                      >
                        <div className="relative w-20 h-20 rounded-full mb-3 overflow-hidden border-2 border-border bg-elevated flex items-center justify-center">
                          {rec.fileName ? (
                            <img
                              src={rec.fileName.replace('localhost', '192.168.1.44')}
                              alt={rec.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                target.nextElementSibling?.removeAttribute('style');
                              }}
                            />
                          ) : null}
                          <span
                            style={rec.fileName ? { display: 'none' } : undefined}
                            className="text-2xl font-bold text-accent"
                          >
                            {rec.nombre.charAt(0)}
                          </span>
                          {recursoId === rec.id && (
                            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                              <Check size={28} className="text-accent drop-shadow" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold">{rec.nombre}</h3>
                        {recursoId === rec.id && (
                          <span className="mt-1 text-xs text-accent flex items-center gap-1">
                            <Check size={12} /> Seleccionado
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Horario */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1"
              >
                <h2 className="text-xl font-semibold mb-4">Selecciona Fecha y Horario</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Fecha</label>
                  <div className="flex items-center gap-2 max-w-sm">
                    <CalendarIcon className="text-secondary" size={20} />
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => {
                        setFecha(e.target.value);
                        setHorarioSeleccionado(null);
                      }}
                      className="flex-1 h-10 px-3 rounded-md border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {loadingDisponibilidad ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                  </div>
                ) : Array.isArray(disponibilidad) && disponibilidad.length > 0 ? (
                  <div className="space-y-6">
                    {(disponibilidad as any[]).map((bloque: any) => (
                      <div key={bloque.horario.id}>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-secondary uppercase tracking-wide">
                          <Clock size={14} className="text-accent" />
                          {bloque.horario.descripcion}
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                          {bloque.rangos.map((rango: any, idx: number) => {
                            const isSelected = horarioSeleccionado?.start === rango.start;
                            const timeStr = new Date(rango.start).toLocaleTimeString('es-ES', {
                              timeZone: 'America/Bogota',
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                            return (
                              <button
                                key={idx}
                                onClick={() => setHorarioSeleccionado(rango)}
                                className={`py-2 px-1 text-sm font-medium rounded-lg border-2 transition-all ${isSelected
                                  ? 'bg-accent border-accent text-white shadow-md shadow-accent/20'
                                  : 'border-border bg-surface hover:border-accent/60 hover:text-accent'
                                  }`}
                              >
                                {timeStr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-secondary border border-dashed border-border rounded-lg bg-elevated/20">
                    <CalendarIcon size={32} className="opacity-30 mb-2" />
                    <p>No hay disponibilidad para la fecha seleccionada.</p>
                    <p className="text-sm mt-1">Por favor elige otro día u otro recurso.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: Confirmar */}
            {step === 5 && (
              <motion.div
                key="step5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Confirmar Reserva</h2>
                <p className="text-secondary max-w-md mb-8">
                  Revisa los datos de tu reserva antes de confirmarla.
                </p>

                <div className="bg-elevated/50 border border-border rounded-xl p-6 w-full max-w-md text-left space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Cliente</span>
                    <span className="font-semibold">{nombreCliente || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Celular</span>
                    <span className="font-semibold">{celularCliente || '—'}</span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Servicio</span>
                    <span className="font-semibold">{servicios?.find(s => s.id === servicioId)?.nombre}</span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Recurso</span>
                    <span className="font-semibold">{recursos?.find(r => r.id === recursoId)?.nombre}</span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-secondary">Fecha y Hora</span>
                    <span className="font-semibold text-accent text-right max-w-[200px] capitalize">
                      {horarioSeleccionado
                        ? new Date(horarioSeleccionado.start).toLocaleString('es-ES', {
                          timeZone: 'America/Bogota',
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : '—'}
                    </span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Costo Total</span>
                    <span className="font-bold text-lg text-accent">
                      {formatCurrency(servicios?.find(s => s.id === servicioId)?.costo ?? 0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1 || isCreating}
            >
              <ArrowLeft size={18} className="mr-2" /> Anterior
            </Button>

            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!nombreCliente || !celularCliente)) ||
                  (step === 2 && !servicioId) ||
                  (step === 3 && !recursoId) ||
                  (step === 4 && !horarioSeleccionado)
                }
              >
                Siguiente <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isCreating}
                className="bg-success hover:bg-success/90 text-white"
              >
                {isCreating ? 'Procesando...' : 'Confirmar Reserva'} <Check size={18} className="ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
