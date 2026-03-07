import { NextRequest, NextResponse } from 'next/server';
import { customPaymentService } from '@/lib/payment-service';

// Webhook para Pago Personalizado (Opción 1)
// El usuario implementará la lógica específica aquí
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    console.log('[Custom Payment Webhook] Received:', webhookData);

    // Llamar al servicio personalizado del usuario
    await customPaymentService.handleWebhook(webhookData);

    return NextResponse.json({ status: 'received' });
  } catch (error: any) {
    console.error('[Custom Payment Webhook] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
