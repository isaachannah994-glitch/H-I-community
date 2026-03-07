'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { registerSchema } from '@/lib/validators';
import { AlertCircle, CheckCircle2, Loader, User, Mail, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function RegisterPage() {
  const [step, setStep] = useState<'info' | 'terms' | 'confirm'>('info');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { firebaseUser, register } = useAuth();
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
      const validation = registerSchema.safeParse({
        email,
        password,
        confirmPassword,
        displayName,
        acceptTerms,
      });

      if (!validation.success) {
        const fieldError = validation.error.errors[0];
        setError(fieldError.message);
        setLoading(false);
        return;
      }

      const result = await register(email, password, displayName);
      if (result.success) {
        setSuccess(true);
        setStep('confirm');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Error en registro');
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
            <p className="text-cyan-400 font-medium">Crear Nueva Cuenta</p>
          </div>

          {/* Success State */}
          {success && step === 'confirm' ? (
            <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-xl">
              <CardContent className="pt-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white">¡Bienvenido!</h2>
                  <p className="text-slate-400">
                    Tu cuenta propietario master ha sido creada. Redirigiendo...
                  </p>
                  <div className="flex justify-center">
                    <Loader className="w-6 h-6 animate-spin text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="text-white text-xl">Crear Cuenta</CardTitle>
                <CardDescription className="text-slate-400">
                  Propietario Master del H&I POS System
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={step} onValueChange={(v) => setStep(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                    <TabsTrigger value="info" disabled={step === 'terms'} className="data-[state=active]:bg-cyan-600">
                      Información
                    </TabsTrigger>
                    <TabsTrigger value="terms" className="data-[state=active]:bg-cyan-600">
                      Términos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-6 mt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive" className="border-red-900/20 bg-red-950/20">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-red-300">{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-slate-300">Nombre Completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <Input
                            id="displayName"
                            type="text"
                            placeholder="Tu nombre"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            disabled={loading}
                            required
                            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          Este será tu email de propietario master
                        </p>
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

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-slate-300">Confirmar Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            required
                            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-all"
                        onClick={() => {
                          if (displayName && email && password && confirmPassword) {
                            setStep('terms');
                          } else {
                            setError('Por favor completa todos los campos');
                          }
                        }}
                        disabled={loading}
                      >
                        Siguiente →
                      </Button>
                    </form>

                    <p className="text-sm text-slate-400 text-center">
                      ¿Ya tienes cuenta?{' '}
                      <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                        Inicia sesión
                      </Link>
                    </p>
                  </TabsContent>

                  <TabsContent value="terms" className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <h3 className="font-semibold text-white mb-3">Términos y Condiciones - H&I POS System</h3>
                        <ScrollArea className="h-48 w-full pr-4">
                          <div className="text-sm text-slate-300 space-y-3">
                            <p>
                              <strong className="text-cyan-400">1. Propiedad y Licencia:</strong> Usted acepta que H&I POS System es propiedad exclusiva de isaac03.24castillo@gmail.com. Se le otorga una licencia no transferible para usar el sistema en sus negocios.
                            </p>
                            <p>
                              <strong className="text-cyan-400">2. Multi-tenant:</strong> Como propietario master, usted puede crear múltiples negocios. Cada negocio tiene sus propios datos, usuarios y configuración completamente aislados.
                            </p>
                            <p>
                              <strong className="text-cyan-400">3. Seguridad:</strong> Sus datos están encriptados y protegidos. Usted es responsable de mantener sus credenciales seguras. No comparta su acceso de propietario master.
                            </p>
                            <p>
                              <strong className="text-cyan-400">4. Cumplimiento:</strong> Usted acepta usar el sistema solo para operaciones comerciales legales. Debe cumplir con todas las leyes fiscales y regulaciones locales.
                            </p>
                            <p>
                              <strong className="text-cyan-400">5. Facturación Fiscal:</strong> El sistema está diseñado para generar comprobantes válidos fiscalmente. Usted es responsable del cumplimiento tributario.
                            </p>
                            <p>
                              <strong className="text-cyan-400">6. Limitaciones:</strong> El sistema se proporciona "tal cual". No garantizamos disponibilidad del 100% sin interrupciones.
                            </p>
                            <p>
                              <strong className="text-cyan-400">7. Datos Personales:</strong> Sus datos será procesados según nuestras políticas de privacidad. No compartimos información con terceros sin consentimiento.
                            </p>
                            <p>
                              <strong className="text-cyan-400">8. Aceptación:</strong> Al hacer clic en "Aceptar", usted confirma que ha leído y acepta estos términos y condiciones.
                            </p>
                          </div>
                        </ScrollArea>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                          <Alert variant="destructive" className="border-red-900/20 bg-red-950/20">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-red-300">{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                          <Checkbox
                            id="terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                            disabled={loading}
                            className="border-cyan-600"
                          />
                          <Label htmlFor="terms" className="text-slate-300 font-normal cursor-pointer flex-1">
                            Acepto los términos y condiciones
                          </Label>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                            onClick={() => setStep('info')}
                            disabled={loading}
                          >
                            ← Atrás
                          </Button>
                          <Button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-all"
                            disabled={!acceptTerms || loading}
                          >
                            {loading ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Creando...
                              </>
                            ) : (
                              'Crear Cuenta'
                            )}
                          </Button>
                        </div>
                      </form>

                      <p className="text-xs text-slate-500 text-center">
                        <Link href="/" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                          ← Volver al inicio
                        </Link>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center">
            © 2026 H&I Community | isaac03.24castillo@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
