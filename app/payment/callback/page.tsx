import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'failed' | 'pending' | 'loading'>('loading');
  const [message, setMessage] = useState('Procesando tu pago...');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const statusParam = searchParams.get('status');
      const transId = searchParams.get('transactionId') || searchParams.get('transaction_id') || '';

      setTransactionId(transId);

      if (statusParam === 'success') {
        setStatus('success');
        setMessage('¡Pago procesado exitosamente!');
      } else if (statusParam === 'failed') {
        setStatus('failed');
        setMessage('El pago fue rechazado. Por favor, intenta nuevamente.');
      } else if (statusParam === 'pending') {
        setStatus('pending');
        setMessage('Tu pago está pendiente de confirmación.');
      }
    };

    processCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Estado del Pago</CardTitle>
          <CardDescription>Resultado de tu transacción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            )}
            {status === 'failed' && (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
            {status === 'pending' && (
              <Clock className="h-16 w-16 text-amber-600" />
            )}
            {status === 'loading' && (
              <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
            )}
          </div>

          {/* Message */}
          <Alert className={
            status === 'success' ? 'bg-green-50 border-green-200' :
            status === 'failed' ? 'bg-red-50 border-red-200' :
            status === 'pending' ? 'bg-amber-50 border-amber-200' :
            'bg-blue-50 border-blue-200'
          }>
            <AlertDescription className={
              status === 'success' ? 'text-green-900' :
              status === 'failed' ? 'text-red-900' :
              status === 'pending' ? 'text-amber-900' :
              'text-blue-900'
            }>
              {message}
            </AlertDescription>
          </Alert>

          {/* Transaction ID */}
          {transactionId && (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="text-gray-600">ID de Transacción:</p>
              <p className="font-mono text-gray-900 break-all">{transactionId}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Atrás
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              className="flex-1"
              variant={status === 'success' ? 'default' : 'outline'}
            >
              Dashboard
            </Button>
          </div>

          {/* Help Text */}
          {status === 'pending' && (
            <p className="text-xs text-center text-gray-600">
              Tu pago está siendo verificado. Recibirás una confirmación en breve.
            </p>
          )}

          {status === 'failed' && (
            <p className="text-xs text-center text-gray-600">
              Si el problema persiste, contacta con soporte.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
