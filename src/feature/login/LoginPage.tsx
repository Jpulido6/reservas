import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';

import { ShieldCheck, User, Building, Phone } from 'lucide-react';
import { useAuthStore } from '../../core/store/auth-store';
import { axiosClient } from '../../core/api/axios-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';

interface Enterprise {
  codigo: string;
  nombre: string;
}

export default function LoginPage() {
  const [context, setContext] = useState('USUARIO'); // 'USUARIO' or 'CLIENTE'
  const [step, setStep] = useState(1); // 1: Context, 2: Enterprise, 3: Login
  const [loading, setLoading] = useState(false);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

  // Form Data
  const [formData, setFormData] = useState({
    contextCode: 'DEFAULT', // Default example
    enterpriseCode: '',
    username: '',
    password: '',
    phoneNumber: '',
    email: '',
    fullName: '',
  });

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleFetchEnterprises = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming a generic endpoint or mock for now as per plan
      const res = await axiosClient.post('/v1/auth/usuarios/fetch-enterprises', {
        contextCode: formData.contextCode,
        username: formData.username,
        password: formData.password,
      });
      setEnterprises(res.data || []);
      if (res.data && res.data.length > 0) {
        setStep(3);
      } else {
        toast.error("No se encontraron empresas para este usuario");
      }
    } catch (error) {
      toast.error('Error al buscar empresas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = context === 'USUARIO' ? '/v1/auth/usuarios/login' : '/v1/auth/clientes/login';
      const payload = context === 'USUARIO' ? {
        contextCode: formData.contextCode,
        enterpriseCode: formData.enterpriseCode,
        username: formData.username,
        password: formData.password,
      } : {
        contextCode: formData.contextCode,
        enterpriseCode: formData.enterpriseCode,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        fullName: formData.fullName,
      };

      const res = await axiosClient.post(endpoint, payload);

      // Save token and get user data
      const token = res.data.token;
      localStorage.setItem('token', token); // For Axios interceptor

      // Fetch user data
      const dataRes = await axiosClient.get('/v1/auth/data');

      setAuth(token, dataRes.data);
      toast.success('Bienvenido al sistema');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión verifique sus datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-soft)] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent-soft)] rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-[var(--accent-soft)] rounded-full flex items-center justify-center mb-4 border border-[var(--accent)]/20">
            <ShieldCheck className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <CardTitle className="text-2xl font-bold">Sistema de Reservas</CardTitle>
          <CardDescription>
            {step === 1 && "Selecciona tu tipo de acceso"}
            {step === 2 && "Ingresa tus credenciales"}
            {step === 3 && "Selecciona una empresa para continuar"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant={context === 'USUARIO' ? 'default' : 'outline'}
                className="h-24 flex flex-col gap-2"
                onClick={() => { setContext('USUARIO'); setStep(2); }}
              >
                <User className="w-8 h-8" />
                <span>Personal</span>
              </Button>
              <Button
                variant={context === 'CLIENTE' ? 'default' : 'outline'}
                className="h-24 flex flex-col gap-2"
                onClick={() => { setContext('CLIENTE'); setStep(2); }}
              >
                <Phone className="w-8 h-8" />
                <span>Cliente</span>
              </Button>
            </div>
          )}

          {step === 2 && context === 'USUARIO' && (
            <form onSubmit={handleFetchEnterprises} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Input
                  type="text"
                  placeholder="Ej: admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>
                Volver
              </Button>
            </form>
          )}

          {step === 2 && context === 'CLIENTE' && (
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  type="tel"
                  placeholder="Ej: 3001234567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre Completo</label>
                <Input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Código de Empresa</label>
                <Input
                  type="text"
                  placeholder="Ej: EMP001"
                  value={formData.enterpriseCode}
                  onChange={(e) => setFormData({ ...formData, enterpriseCode: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar como Cliente'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>
                Volver
              </Button>
            </form>
          )}

          {step === 3 && context === 'USUARIO' && (
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecciona tu Empresa</label>
                <div className="grid gap-2">
                  {enterprises.length > 0 ? enterprises.map(emp => (
                    <Button
                      key={emp.codigo}
                      type="button"
                      variant={formData.enterpriseCode === emp.codigo ? 'default' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => setFormData({ ...formData, enterpriseCode: emp.codigo })}
                    >
                      <Building className="w-4 h-4 mr-2" />
                      {emp.nombre}
                    </Button>
                  )) : (
                    // Mock data fallback for demonstration if API fails/empty
                    <Button
                      type="button"
                      variant={formData.enterpriseCode === 'EMPBYDEFTO' ? 'default' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => setFormData({ ...formData, enterpriseCode: 'EMPBYDEFTO' })}
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Empresa Principal (Mock)
                    </Button>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !formData.enterpriseCode}
              >
                {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(2)}>
                Volver
              </Button>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
