'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAllSuppliers, createSupplier, getAllPurchaseOrders, createPurchaseOrder } from '@/lib/inventory-service';
import { getAllProducts } from '@/lib/pos-service';
import { Supplier, PurchaseOrder, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Plus, Loader } from 'lucide-react';
import Link from 'link';

export default function PurchasesPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [openPODialog, setOpenPODialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 30,
  });
  const [newPO, setNewPO] = useState({
    supplierId: '',
    items: [] as { productId: string; quantity: number; unitPrice: number }[],
    selectedProduct: '',
    selectedQuantity: '',
    selectedPrice: '',
  });

  useEffect(() => {
    loadData();
  }, [businessId]);

  const loadData = async () => {
    try {
      const [sups, pos, prods] = await Promise.all([
        getAllSuppliers(businessId),
        getAllPurchaseOrders(businessId),
        getAllProducts(businessId),
      ]);

      setSuppliers(sups);
      setPurchaseOrders(pos);
      setProducts(prods);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.name) return;

    setIsSubmitting(true);
    try {
      const result = await createSupplier(businessId, {
        name: newSupplier.name,
        contactName: newSupplier.contactName || undefined,
        email: newSupplier.email || undefined,
        phone: newSupplier.phone || undefined,
        address: newSupplier.address || undefined,
        paymentTerms: newSupplier.paymentTerms,
        isActive: true,
      });

      if (result.success) {
        await loadData();
        setOpenSupplierDialog(false);
        setNewSupplier({
          name: '',
          contactName: '',
          email: '',
          phone: '',
          address: '',
          paymentTerms: 30,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPOItem = () => {
    if (!newPO.selectedProduct || !newPO.selectedQuantity || !newPO.selectedPrice) return;

    setNewPO({
      ...newPO,
      items: [
        ...newPO.items,
        {
          productId: newPO.selectedProduct,
          quantity: parseInt(newPO.selectedQuantity),
          unitPrice: parseFloat(newPO.selectedPrice),
        },
      ],
      selectedProduct: '',
      selectedQuantity: '',
      selectedPrice: '',
    });
  };

  const handleCreatePO = async () => {
    if (!newPO.supplierId || newPO.items.length === 0) return;

    setIsSubmitting(true);
    try {
      const subtotal = newPO.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const tax = subtotal * 0.1; // 10% tax

      const result = await createPurchaseOrder(businessId, {
        supplierId: newPO.supplierId,
        orderNumber: `PO-${Date.now()}`,
        items: newPO.items,
        subtotal,
        tax,
        total: subtotal + tax,
        status: 'pending',
      });

      if (result.success) {
        await loadData();
        setOpenPODialog(false);
        setNewPO({
          supplierId: '',
          items: [],
          selectedProduct: '',
          selectedQuantity: '',
          selectedPrice: '',
        });
      }
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold">Gestión de Compras</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="suppliers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
            <TabsTrigger value="orders">Órdenes de Compra</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Proveedores</h2>
              <Dialog open={openSupplierDialog} onOpenChange={setOpenSupplierDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Proveedor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Proveedor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Nombre *</Label>
                      <Input
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Contacto</Label>
                      <Input
                        value={newSupplier.contactName}
                        onChange={(e) => setNewSupplier({ ...newSupplier, contactName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={newSupplier.email}
                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        value={newSupplier.phone}
                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Términos de Pago (días)</Label>
                      <Input
                        type="number"
                        value={newSupplier.paymentTerms}
                        onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: parseInt(e.target.value) })}
                      />
                    </div>
                    <Button onClick={handleAddSupplier} className="w-full" disabled={isSubmitting}>
                      Guardar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {suppliers.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">No hay proveedores</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead className="text-right">Términos (días)</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.contactName || '-'}</TableCell>
                        <TableCell>{supplier.email || '-'}</TableCell>
                        <TableCell>{supplier.phone || '-'}</TableCell>
                        <TableCell className="text-right">{supplier.paymentTerms}</TableCell>
                        <TableCell>
                          {supplier.isActive ? (
                            <Badge variant="default" className="bg-green-600">Activo</Badge>
                          ) : (
                            <Badge variant="secondary">Inactivo</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Órdenes de Compra</h2>
              <Dialog open={openPODialog} onOpenChange={setOpenPODialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Orden
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Orden de Compra</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                    <div>
                      <Label>Proveedor *</Label>
                      <Select value={newPO.supplierId} onValueChange={(v) => setNewPO({ ...newPO, supplierId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">Artículos</h3>
                      <div className="space-y-2 mb-3">
                        <div>
                          <Label>Producto</Label>
                          <Select value={newPO.selectedProduct} onValueChange={(v) => setNewPO({ ...newPO, selectedProduct: v })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Cantidad</Label>
                            <Input
                              type="number"
                              value={newPO.selectedQuantity}
                              onChange={(e) => setNewPO({ ...newPO, selectedQuantity: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Precio Unitario</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newPO.selectedPrice}
                              onChange={(e) => setNewPO({ ...newPO, selectedPrice: e.target.value })}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddPOItem} variant="outline" className="w-full">
                          Agregar Artículo
                        </Button>
                      </div>

                      {newPO.items.length > 0 && (
                        <div className="space-y-2">
                          {newPO.items.map((item, i) => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                              <div key={i} className="flex justify-between bg-muted p-2 rounded">
                                <span>{product?.name}</span>
                                <span className="font-semibold">
                                  {item.quantity} x ${item.unitPrice.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                          <div className="border-t pt-2 font-bold text-lg">
                            Total: ${newPO.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button onClick={handleCreatePO} className="w-full" disabled={isSubmitting || newPO.items.length === 0}>
                      Crear Orden
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {purchaseOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">No hay órdenes de compra</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => {
                      const supplier = suppliers.find(s => s.id === po.supplierId);
                      return (
                        <TableRow key={po.id}>
                          <TableCell className="font-medium">{po.orderNumber}</TableCell>
                          <TableCell>{supplier?.name || '-'}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ${po.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {po.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(po.createdAt).toLocaleDateString()}
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
