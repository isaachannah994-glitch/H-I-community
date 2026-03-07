import { NextRequest, NextResponse } from 'next/server';
import {
  twoCheckoutService,
  payUService,
  mercadoPagoService,
  customPaymentService,
  recordLocalPayment,
} from '@/lib/payment-service';
import { PAYMENT_PROVIDERS } from '@/lib/payment-config';

export async function POST(request: NextRequest) {
  try {
    const {
      businessId,
      saleId,
      amount,
      currency,
      provider,
      customerEmail,
      customerName,
      customerPhone,
    } = await request.json();

    // Validaciones
    if (!businessId || !saleId || !amount || !provider) {
      return NextResponse.json(
        { error: 'Parámetros requeridos faltantes' },
        { status: 400 }
      );
    }

    let result;

    switch (provider) {
      case PAYMENT_PROVIDERS.TWO_CHECKOUT:
        result = await twoCheckoutService.initializePayment(
          businessId,
          saleId,
          amount,
          currency,
          customerEmail,
          customerName
        );
        break;

      case PAYMENT_PROVIDERS.PAYU:
        result = await payUService.initializePayment(
          businessId,
          saleId,
          amount,
          currency,
          customerEmail,
          customerName,
          customerPhone || ''
        );
        break;

      case PAYMENT_PROVIDERS.MERCADO_PAGO:
        result = await mercadoPagoService.initializePayment(
          businessId,
          saleId,
          amount,
          currency,
          customerEmail,
          customerName
        );
        break;

      case PAYMENT_PROVIDERS.CUSTOM:
        result = await customPaymentService.initializePayment(
          businessId,
          saleId,
          amount,
          currency,
          {
            customerEmail,
            customerName,
            customerPhone,
          }
        );
        break;

      case PAYMENT_PROVIDERS.CASH:
      case PAYMENT_PROVIDERS.TRANSFER:
      case PAYMENT_PROVIDERS.CHECK:
        result = await recordLocalPayment(
          businessId,
          saleId,
          amount,
          provider as 'cash' | 'transfer' | 'check',
          currency
        );
        result = {
          transactionId: result.id,
          status: 'completed',
          localPayment: true,
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Proveedor de pago no soportado' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Payment API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error procesando pago' },
      { status: 500 }
    );
  }
}
