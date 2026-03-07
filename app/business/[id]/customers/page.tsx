'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAllCustomers, createCustomer, updateCustomer, addLoyaltyPoints } from '@/lib/crm-finance-service';
import { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Loader, Users } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CustomersPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadCustomers();
  }, [businessId]);

  const loadCustomers = async () => {
    try {
      const custs = await getAllCustomers(businessId);
      setCustomers(custs);
    } catch (err) {
      setError('Error cargando clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name) {
      setError('El nombre es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCustomer(businessId, {
        name: newCustomer.name,
        email: newCustomer.email || undefined,
        phone: newCustomer.phone || undefined,
        address: newCustomer.address || undefined,
        isActive: true,
      });

      if (result.success) {
        await loadCustomers();
        setOpenDialog(false);
        setNewCustomer({ name: '', email: '', phone: '', address: '' });
        setError('');
      } else {
        setError(result.error || 'Error agregando cliente');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'recurring':
        return 'bg-blue-100 text-blue-800';
      case 'occasional':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/business/${businessId}`} className="flex items-center gap-2 text-primary hover:underline mb-4 inline-flex">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Gestión de Clientes
            </h1>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleAddCustomer}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {customers.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No hay clientes registrados</p>
              <Button onClick={() => setOpenDialog(true)}>
                Agregar Primer Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{customers.length}</div>
                    <p className="text-sm text-muted-foreground">Clientes Totales</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">
                      {customers.filter(c => c.segment === 'vip').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Clientes VIP</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">
                      ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-right">Compras</TableHead>
                    <TableHead className="text-right">Total Gastado</TableHead>
                    <TableHead>Segmento</TableHead>
                    <TableHead className="text-right">Puntos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell className="text-right">{customer.totalTransactions}</TableCell>
                      <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getSegmentColor(customer.segment)} variant="outline">
                          {customer.segment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {customer.loyaltyPoints}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
