import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoService } from '@/lib/payment-service';

// Webhook para Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    console.log('[Mercado Pago Webhook] Received:', webhookData);

    // Validar e procesar webhook
    await mercadoPagoService.handleWebhook(webhookData);

    return NextResponse.json({ status: 'received' });
  } catch (error: any) {
    console.error('[Mercado Pago Webhook] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
