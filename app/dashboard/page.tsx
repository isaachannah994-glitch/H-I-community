'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getUserBusinesses, logoutUser } from '@/lib/auth-service';
import { Business } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  ShoppingCart,
  LogOut,
  Settings,
  Plus,
  Store,
  BarChart3,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Loader,
} from 'lucide-react';

export default function DashboardPage() {
  const { firebaseUser, userData, loading } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
      return;
    }

    if (firebaseUser && userData?.role === 'master_admin') {
      loadBusinesses();
    }
  }, [firebaseUser, userData, loading, router]);

  const loadBusinesses = async () => {
    try {
      const biz = await getUserBusinesses(firebaseUser!.uid);
      setBusinesses(biz);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  if (loading || (firebaseUser && loadingBusinesses)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">H&I POS System</h1>
              <p className="text-xs text-muted-foreground">{userData?.displayName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Configuración</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/settings/profile')}>
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings/security')}>
                  Seguridad
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              ¡Bienvenido, {userData?.displayName}!
            </h2>
            <p className="text-muted-foreground">
              Gestiona todos tus negocios desde aquí
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push('/businesses/new')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Nuevo Negocio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Añade un nuevo negocio al sistema
                </p>
              </CardContent>
            </Card>

            {businesses.length > 0 && (
              <>
                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push(`/business/${businesses[0].id}/pos`)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      Punto de Venta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Gestionar ventas
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push(`/business/${businesses[0].id}/inventory`)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Inventario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Gestionar stock
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push(`/business/${businesses[0].id}/reports`)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Reportes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Ver analytics
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Businesses Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Mis Negocios</h3>
              <Button onClick={() => router.push('/businesses/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Negocio
              </Button>
            </div>

            {businesses.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Sin Negocios</h3>
                  <p className="text-muted-foreground mb-6">
                    Crea tu primer negocio para empezar a usar H&I POS
                  </p>
                  <Button onClick={() => router.push('/businesses/new')}>
                    Crear Primer Negocio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business) => (
                  <Card key={business.id} className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push(`/business/${business.id}`)}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{business.name}</CardTitle>
                          <CardDescription className="capitalize">
                            {business.type.replace('_', ' ')}
                          </CardDescription>
                        </div>
                        {business.isActive && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Activo
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {business.address && (
                        <p className="text-sm text-muted-foreground">{business.address}</p>
                      )}
                      <div className="flex gap-2 pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/business/${business.id}`);
                          }}
                        >
                          Ver Detalle
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/business/${business.id}/pos`);
                          }}
                        >
                          POS
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Info Cards */}
          {businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Negocios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businesses.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Negocios Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businesses.filter(b => b.isActive).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tipos de Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(businesses.map(b => b.type)).size}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Estado del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Activo</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
