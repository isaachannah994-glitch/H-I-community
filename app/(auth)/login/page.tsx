'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { loginSchema } from '@/lib/validators';
import { AlertCircle, Loader, Lock, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { firebaseUser, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (firebaseUser) {
      router.push('/dashboard');
    }
  }, [firebaseUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        const fieldError = validation.error.errors[0];
        setError(fieldError.message);
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Error en inicio de sesión');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <Image
                  src="/hi-pos-logo-professional.jpg"
                  alt="H&I POS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">H&I POS</h1>
            <p className="text-cyan-400 font-medium">Sistema Integral de Gestión</p>
          </div>

          {/* Login Card */}
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-white text-xl">Iniciar Sesión</CardTitle>
              <CardDescription className="text-slate-400">
                Accede a tu cuenta propietario master
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-900/20 bg-red-950/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="isaac03.24castillo@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-all"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-700 space-y-4">
                <p className="text-sm text-slate-400 text-center">
                  ¿No tienes cuenta?{' '}
                  <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                    Crear una aquí
                  </Link>
                </p>

                <p className="text-xs text-slate-500 text-center">
                  <Link href="/" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                    ← Volver al inicio
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center">
            © 2026 H&I Community | isaac03.24castillo@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { firebaseUser, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (firebaseUser) {
      router.push('/dashboard');
    }
  }, [firebaseUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        const fieldError = validation.error.errors[0];
        setError(fieldError.message);
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Error en inicio de sesión');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-blue-900">
              H&I
            </div>
            <h1 className="text-2xl font-bold text-white">H&I POS System</h1>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Gestión Integral de Negocios
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              El mejor sistema de Punto de Venta para bodegas, ferreterías, restaurantes, zapaterías, tiendas de ropa y repuestos.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-900 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Punto de Venta Moderno</h3>
                  <p className="text-blue-100 text-sm">Interfaz intuitiva y rápida</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-900 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Múltiples Pagos</h3>
                  <p className="text-blue-100 text-sm">Efectivo, transferencia, tarjeta y más</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-900 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Control de Inventario</h3>
                  <p className="text-blue-100 text-sm">Seguimiento en tiempo real</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-900 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Reportes Avanzados</h3>
                  <p className="text-blue-100 text-sm">Analítica y dashboards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-100 text-sm">
            © 2026 H&I Community. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-gradient-to-b from-background to-secondary/5">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                H&I
              </div>
              <h1 className="text-2xl font-bold text-blue-600">H&I POS</h1>
            </div>
          </div>

          <Card>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta H&I POS System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-secondary/50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  ¿No tienes cuenta?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Registrarse aquí
                  </Link>
                </p>

                <p className="text-xs text-muted-foreground text-center">
                  <Link href="/" className="text-blue-600 hover:underline">
                    Volver al inicio
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Propietario: isaac03.24castillo@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
