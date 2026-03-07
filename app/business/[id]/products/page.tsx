'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAllProducts, createProduct, updateProduct } from '@/lib/pos-service';
import { Product } from '@/lib/types';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Loader, AlertCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as XLSX from 'xlsx';

export default function ProductsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    costPrice: 0,
    quantity: 0,
    minStock: 0,
    unit: 'unidad' as const,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [businessId]);

  const loadProducts = async () => {
    try {
      const prods = await getAllProducts(businessId);
      setProducts(prods);
    } catch (err) {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sku) {
      setError('Nombre y SKU son requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createProduct(businessId, {
        ...newProduct,
        isActive: true,
      });

      if (result.success) {
        await loadProducts();
        setOpenDialog(false);
        setNewProduct({
          name: '',
          sku: '',
          category: '',
          price: 0,
          costPrice: 0,
          quantity: 0,
          minStock: 0,
          unit: 'unidad',
        });
        setError('');
      } else {
        setError(result.error || 'Error agregando producto');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        for (const row of jsonData) {
          await createProduct(businessId, {
            name: row.name,
            sku: row.sku,
            barcode: row.barcode,
            category: row.category,
            price: parseFloat(row.price),
            costPrice: parseFloat(row.costPrice),
            quantity: parseInt(row.quantity),
            minStock: parseInt(row.minStock),
            unit: row.unit || 'unidad',
            isActive: true,
          });
        }

        await loadProducts();
        setError('');
      } catch (err: any) {
        setError(`Error en carga masiva: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
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
            <h1 className="text-3xl font-bold">Gestión de Productos</h1>
            <div className="flex gap-2">
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sku">SKU *</Label>
                        <Input
                          id="sku"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoría</Label>
                        <Input
                          id="category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Precio Venta</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="costPrice">Precio Costo</Label>
                        <Input
                          id="costPrice"
                          type="number"
                          step="0.01"
                          value={newProduct.costPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) })}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Stock Inicial</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="minStock">Stock Mínimo</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={newProduct.minStock}
                          onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) })}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleAddProduct}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Excel
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {products.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">No hay productos</p>
              <Button onClick={() => setOpenDialog(true)}>
                Agregar Producto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {product.quantity <= product.minStock ? (
                        <Badge variant="destructive">{product.quantity}</Badge>
                      ) : (
                        <span>{product.quantity}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.isActive ? (
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
      </main>
    </div>
  );
}
