'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBusiness, getBusinessUsers } from '@/lib/auth-service';
import { Business, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader, Plus, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function BusinessDetailPage() {
  const params = useParams();
  const businessId = params.id as string;
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [businessId]);

  const loadData = async () => {
    try {
      const bizData = await getBusiness(businessId);
      setBusiness(bizData);

      if (bizData) {
        const usersData = await getBusinessUsers(businessId);
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-4 inline-flex">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-muted-foreground">Negocio no encontrado</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-4 inline-flex">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <p className="text-muted-foreground capitalize">
                {business.type.replace('_', ' ')} • {business.isActive ? 'Activo' : 'Inactivo'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/business/${businessId}/pos`)}>
                Ir a POS
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tipo de Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold capitalize">
                    {business.type.replace('_', ' ')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="capitalize">
                    {business.subscriptionType}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {business.address || 'No especificada'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {business.phone || 'No especificado'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Usuarios del Negocio</h3>
              <Button size="sm" onClick={() => router.push(`/business/${businessId}/users/new`)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Usuario
              </Button>
            </div>

            {users.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <UserIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No hay usuarios en este negocio</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell className="font-medium">
                          {user.displayName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <Badge variant="default" className="bg-green-600">
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactivo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => router.push(`/business/${businessId}/users/${user.uid}/edit`)}
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Negocio</CardTitle>
                <CardDescription>
                  Ajusta los parámetros generales de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Moneda</label>
                  <p className="text-muted-foreground">
                    {business.settings?.currency || 'USD'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Zona Horaria</label>
                  <p className="text-muted-foreground">
                    {business.settings?.timezone || 'UTC'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Idioma</label>
                  <p className="text-muted-foreground capitalize">
                    {business.settings?.language === 'es' ? 'Español' : 'English'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
