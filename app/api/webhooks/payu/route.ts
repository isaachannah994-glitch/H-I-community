import { NextRequest, NextResponse } from 'next/server';
import { payUService } from '@/lib/payment-service';

// Webhook para PayU
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    console.log('[PayU Webhook] Received:', webhookData);

    // Validar e procesar webhook
    await payUService.handleWebhook(webhookData);

    return NextResponse.json({ status: 'received' });
  } catch (error: any) {
    console.error('[PayU Webhook] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
