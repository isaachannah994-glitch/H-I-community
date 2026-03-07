'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAllProducts } from '@/lib/pos-service';
import { getStockAlerts, recordInventoryMovement, getInventoryMovements } from '@/lib/inventory-service';
import { Product, StockAlert, InventoryMovement } from '@/lib/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader, AlertTriangle, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [movementData, setMovementData] = useState({
    productId: '',
    type: 'in' as const,
    quantity: 0,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [businessId]);

  const loadData = async () => {
    try {
      const [prods, stockAlerts, invMovements] = await Promise.all([
        getAllProducts(businessId),
        getStockAlerts(businessId),
        getInventoryMovements(businessId),
      ]);

      setProducts(prods);
      setAlerts(stockAlerts);
      setMovements(invMovements);
    } catch (err) {
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovement = async () => {
    if (!movementData.productId || movementData.quantity <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await recordInventoryMovement(businessId, {
        productId: movementData.productId,
        warehouseId: 'main',
        type: movementData.type,
        quantity: movementData.quantity,
        notes: movementData.notes,
        timestamp: Date.now(),
      });

      await loadData();
      setOpenDialog(false);
      setMovementData({
        productId: '',
        type: 'in',
        quantity: 0,
        notes: '',
      });
    } catch (err) {
      console.error('Error adding movement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);

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
            <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="product">Producto *</Label>
                    <Select value={movementData.productId} onValueChange={(v) => setMovementData({ ...movementData, productId: v })}>
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo de Movimiento *</Label>
                    <Select value={movementData.type} onValueChange={(v) => setMovementData({ ...movementData, type: v as any })}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Entrada (Compra)</SelectItem>
                        <SelectItem value="out">Salida (Venta)</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                        <SelectItem value="adjustment">Ajuste</SelectItem>
                        <SelectItem value="return">Devolución</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Cantidad *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={movementData.quantity}
                      onChange={(e) => setMovementData({ ...movementData, quantity: parseInt(e.target.value) })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas</Label>
                    <Input
                      id="notes"
                      value={movementData.notes}
                      onChange={(e) => setMovementData({ ...movementData, notes: e.target.value })}
                      placeholder="Referencia, motivo del movimiento, etc."
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleAddMovement}
                    disabled={isSubmitting || !movementData.productId}
                  >
                    {isSubmitting ? 'Registrando...' : 'Registrar Movimiento'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="movements">Movimientos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Productos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">en el sistema</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Valor Total del Inventario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">a precio de venta</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Productos Bajo Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
                  <p className="text-xs text-muted-foreground">necesitan reorden</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Stock Actual</TableHead>
                    <TableHead className="text-right">Stock Mínimo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const value = product.quantity * product.price;
                    const isLow = product.quantity <= product.minStock;
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {product.minStock}
                        </TableCell>
                        <TableCell>
                          {isLow ? (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              Bajo Stock
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-600">
                              OK
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">${value.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">Sin alertas de inventario</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4 pb-4 flex items-start gap-4">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-900">{alert.message}</p>
                        <p className="text-sm text-yellow-700">Tipo: {alert.type}</p>
                      </div>
                      {!alert.isResolved && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Activa
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="movements">
            {movements.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">Sin movimientos de inventario</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead>Referencia</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.slice(-20).reverse().map((movement) => {
                      const product = products.find(p => p.id === movement.productId);
                      const typeColor = movement.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                      
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>
                            <Badge className={typeColor} variant="outline">
                              {movement.type === 'in' ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {movement.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{product?.name || 'Producto'}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {movement.quantity}
                          </TableCell>
                          <TableCell className="text-sm">{movement.reference || '-'}</TableCell>
                          <TableCell className="text-sm">{movement.notes || '-'}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(movement.timestamp).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
