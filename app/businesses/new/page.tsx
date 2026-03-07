'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createBusiness } from '@/lib/auth-service';
import { businessSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateBusinessPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('bodega');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { firebaseUser, userData } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validation = businessSchema.safeParse({
        name,
        type: type as any,
        address,
        phone,
        taxId,
      });

      if (!validation.success) {
        const fieldError = validation.error.errors[0];
        setError(fieldError.message);
        setLoading(false);
        return;
      }

      if (!firebaseUser || !userData) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      const result = await createBusiness({
        name,
        type: type as any,
        ownerEmail: firebaseUser.email!,
        ownerUid: firebaseUser.uid,
        address,
        phone,
        taxId,
        isActive: true,
        subscriptionType: 'free',
        settings: {
          currency: 'USD',
          timezone: 'UTC',
          taxRate: 0,
          invoicePrefix: `${name.substring(0, 3).toUpperCase()}`,
          receiptFormat: 'thermal',
          language: 'es',
          acceptsMultipleCurrency: true,
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/business/${result.businessId}`);
        }, 1500);
      } else {
        setError(result.error || 'Error creando negocio');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-4 inline-flex">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>
      </header>

      {/* Form Section */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Crear Nuevo Negocio</CardTitle>
            <CardDescription>
              Configura tu nuevo negocio en H&I POS System
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✓</div>
                <h3 className="text-lg font-semibold">¡Negocio Creado!</h3>
                <p className="text-muted-foreground">
                  Tu negocio ha sido creado exitosamente. Serás redirigido al panel de control.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Negocio *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Mi Tienda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Negocio *</Label>
                  <Select value={type} onValueChange={setType} disabled={loading}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecciona tipo de negocio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bodega">Bodega</SelectItem>
                      <SelectItem value="ferreteria">Ferretería</SelectItem>
                      <SelectItem value="restaurante">Restaurante</SelectItem>
                      <SelectItem value="zapateria">Zapatería</SelectItem>
                      <SelectItem value="tienda_ropa">Tienda de Ropa</SelectItem>
                      <SelectItem value="repuestos_motos">Repuestos de Motos</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Calle, número, ciudad"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="Ej: +123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">RUC/NIT</Label>
                  <Input
                    id="taxId"
                    placeholder="Número fiscal"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <Button type="submit" className="w-full" disabled={loading || !name}>
                    {loading ? 'Creando Negocio...' : 'Crear Negocio'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/dashboard')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
