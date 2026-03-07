import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Check, Clock, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PAYMENT_PROVIDERS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_FEES,
  PAYMENT_METHODS_BY_BUSINESS_TYPE,
} from '@/lib/payment-config';
import type { PaymentProvider } from '@/lib/payment-config';

interface PaymentFormProps {
  businessId: string;
  saleId: string;
  amount: number;
  currency: string;
  businessType: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  onPaymentInitiated?: (result: any) => void;
  onPaymentCompleted?: () => void;
  onError?: (error: string) => void;
}

export function PaymentForm({
  businessId,
  saleId,
  amount,
  currency,
  businessType,
  customerEmail,
  customerName,
  customerPhone = '',
  onPaymentInitiated,
  onPaymentCompleted,
  onError,
}: PaymentFormProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableMethods = (PAYMENT_METHODS_BY_BUSINESS_TYPE[businessType as keyof typeof PAYMENT_METHODS_BY_BUSINESS_TYPE] || ['cash', 'transfer']) as PaymentProvider[];
  
  const fee = PAYMENT_FEES[selectedProvider] || 0;
  const feeAmount = (amount * fee) / 100;
  const totalAmount = amount + feeAmount;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      // Validaciones básicas
      if (!selectedProvider) {
        throw new Error('Debe seleccionar un método de pago');
      }

      // Llamar al endpoint de pagos
      const paymentResponse = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          saleId,
          amount,
          currency,
          provider: selectedProvider,
          customerEmail,
          customerName,
          customerPhone,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Error procesando pago');
      }

      response = await paymentResponse.json();

      if (onPaymentInitiated) {
        onPaymentInitiated(response);
      }

      // Redirigir si es necesario (para 2Checkout, PayU, Mercado Pago)
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }

      if (onPaymentCompleted) {
        onPaymentCompleted();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error procesando el pago';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const isLocalPayment = ['cash', 'transfer', 'check'].includes(selectedProvider);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
          <CardDescription>Selecciona cómo deseas procesar este pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métodos de Pago Locales */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Pagos Locales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['cash', 'transfer', 'check'].map((method) => (
                <Button
                  key={method}
                  variant={selectedProvider === method ? 'default' : 'outline'}
                  onClick={() => setSelectedProvider(method as PaymentProvider)}
                  className="justify-start"
                >
                  {PAYMENT_METHOD_LABELS[method as PaymentProvider]}
                </Button>
              ))}
            </div>
          </div>

          {/* Métodos de Pago Digitales */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Opciones de Pago Digital</h3>
            <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona proveedor de pagos" />
              </SelectTrigger>
              <SelectContent>
                {availableMethods
                  .filter((method) => !['cash', 'transfer', 'check'].includes(method))
                  .map((method) => (
                    <SelectItem key={method} value={method}>
                      <span className="flex items-center gap-2">
                        {PAYMENT_METHOD_LABELS[method as PaymentProvider]}
                        {method === 'mercadopago' && <span className="text-xs text-gray-500">(Recomendado)</span>}
                      </span>
                    </SelectItem>
                  ))}
                {/* Mostrar opción personalizada si está disponible */}
                {availableMethods.includes('custom' as PaymentProvider) && (
                  <SelectItem value="custom">
                    <span className="flex items-center gap-2">
                      Pago Personalizado
                      <span className="text-xs text-blue-500">(Implementado)</span>
                    </span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Monto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monto Original:</span>
            <span className="font-semibold">{amount.toFixed(2)} {currency}</span>
          </div>

          {fee > 0 && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Comisión ({fee}%):</span>
                <span className="text-red-600">{feeAmount.toFixed(2)} {currency}</span>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total a Cobrar:</span>
                  <span className="text-lg">{totalAmount.toFixed(2)} {currency}</span>
                </div>
              </div>
            </>
          )}

          {isLocalPayment && (
            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                El pago local será registrado sin comisión. Asegúrate de confirmar que recibiste el monto exacto.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Información de Proveedor */}
      {selectedProvider !== 'cash' && selectedProvider !== 'transfer' && selectedProvider !== 'check' && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-base">Información del Proveedor</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProvider === 'mercadopago' && (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-700">Mercado Pago</p>
                <p className="text-gray-600">Serás redirigido a la plataforma segura de Mercado Pago para completar el pago.</p>
                <p className="text-xs text-gray-500">Comisión: {PAYMENT_FEES.mercadopago}%</p>
              </div>
            )}

            {selectedProvider === 'payu' && (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-700">PayU</p>
                <p className="text-gray-600">Serás redirigido a PayU para procesar el pago de forma segura.</p>
                <p className="text-xs text-gray-500">Comisión: {PAYMENT_FEES.payu}%</p>
              </div>
            )}

            {selectedProvider === '2checkout' && (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-700">2Checkout</p>
                <p className="text-gray-600">Procesaremos el pago a través de 2Checkout de forma segura.</p>
                <p className="text-xs text-gray-500">Comisión: {PAYMENT_FEES['2checkout']}%</p>
              </div>
            )}

            {selectedProvider === 'custom' && (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-700">Pago Personalizado</p>
                <p className="text-gray-600">Se utilizará tu método de pago personalizado configurado.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Instrucciones para Pagos Locales */}
      {isLocalPayment && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base text-amber-900">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProvider === 'cash' && (
              <ul className="text-sm text-amber-900 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Recibe el pago en efectivo del cliente
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Confirma el monto exacto: {amount.toFixed(2)} {currency}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Entrega el recibo o factura
                </li>
              </ul>
            )}

            {selectedProvider === 'transfer' && (
              <ul className="text-sm text-amber-900 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Comparte los detalles bancarios con el cliente
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Monto: {amount.toFixed(2)} {currency}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Confirma la transferencia antes de entregar
                </li>
              </ul>
            )}

            {selectedProvider === 'check' && (
              <ul className="text-sm text-amber-900 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Recibe el cheque del cliente
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Verifica que sea por {amount.toFixed(2)} {currency}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Registra los detalles del cheque
                </li>
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botón de Pago */}
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        {loading ? (
          <>
            <Clock className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : isLocalPayment ? (
          'Confirmar Pago Local'
        ) : (
          `Proceder a ${PAYMENT_METHOD_LABELS[selectedProvider]}`
        )}
      </Button>
    </div>
  );
}
