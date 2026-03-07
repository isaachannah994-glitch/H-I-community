'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAllProducts, createSale, calculateTotals } from '@/lib/pos-service';
import { Product, CartItem, Sale } from '@/lib/types';
import { PaymentForm } from '@/components/payment-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Search, 
  Trash2, 
  DollarSign, 
  Plus, 
  Minus,
  Loader,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function POSPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('Cliente');
  const [businessType, setBusinessType] = useState('bodega');

  useEffect(() => {
    loadProducts();
  }, [businessId]);

  const loadProducts = async () => {
    try {
      const prods = await getAllProducts(businessId);
      setProducts(prods.filter(p => p.isActive));
    } catch (err) {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.includes(searchTerm) ||
    p.barcode?.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity < product.quantity) {
        existing.quantity += 1;
        existing.subtotal = existing.quantity * existing.price;
        setCart([...cart]);
      }
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          quantity: 1,
          price: product.price,
          subtotal: product.price,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      const item = cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = newQuantity;
        item.subtotal = newQuantity * item.price;
        setCart([...cart]);
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const { subtotal, tax, total } = calculateTotals(cart, taxRate);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Carrito vacío');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const saleResult = await createSale(businessId, {
        items: cart,
        subtotal,
        tax,
        total,
        paymentMethod: paymentMethod as any,
        paymentCurrency: 'local',
        cashier: 'ADMIN',
        status: 'pending', // Cambiar a pending hasta confirmar pago
        isElectronic: true,
        isPrinted: false,
      });

      if (saleResult.success) {
        // Guardar datos de venta actual
        setCurrentSaleId(saleResult.saleId || '');
        
        // Mostrar formulario de pagos
        setShowPaymentForm(true);
      } else {
        setError(saleResult.error || 'Error creando venta');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCompleted = () => {
    // Limpiar carrito y mostrar éxito
    setCart([]);
    setSuccess(true);
    setShowPaymentForm(false);
    setCurrentSaleId('');
    setTimeout(() => setSuccess(false), 3000);
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
    setShowPaymentForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b p-4 bg-card">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Punto de Venta
            </h1>
          </div>
          <Link href={`/business/${businessId}`} className="text-sm text-primary hover:underline">
            Volver a Negocio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        {/* Left: Products */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, SKU o código de barras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="p-3 border rounded-lg hover:bg-accent transition text-left"
                  >
                    <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    <p className="text-sm font-bold text-primary mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stock: {product.quantity}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Cart Summary */}
        <div className="w-full md:w-96 flex flex-col gap-4">
          {/* Cart Items */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Carrito</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Carrito vacío
                </p>
              ) : (
                cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={item.productId} className="border rounded-lg p-2 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{product?.name}</p>
                          <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-destructive hover:bg-destructive/10 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="border rounded p-1 hover:bg-accent"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="border rounded p-1 hover:bg-accent"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-semibold text-sm">
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Totals and Payment */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert variant="default" className="border-green-600 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ¡Venta registrada exitosamente!
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impuesto ({taxRate}%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="check">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full py-6 text-lg"
                  disabled={cart.length === 0 || processing}
                  onClick={handleCheckout}
                >
                  {processing ? 'Procesando...' : `Cobrar $${total.toFixed(2)}`}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                >
                  Cancelar Venta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Procesar Pago</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPaymentForm(false)}
                className="absolute right-4 top-4"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <PaymentForm
                businessId={businessId}
                saleId={currentSaleId}
                amount={total}
                currency="COP"
                businessType={businessType}
                customerEmail={customerEmail || 'cliente@example.com'}
                customerName={customerName}
                onPaymentCompleted={handlePaymentCompleted}
                onError={handlePaymentError}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
