import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingCart, Package, BarChart3, Users, DollarSign, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Punto de Venta (POS)',
      description: 'Sistema completo de facturación con escaneo de códigos de barras, múltiples métodos de pago y soporte multimoneda',
    },
    {
      icon: Package,
      title: 'Gestión de Inventario',
      description: 'Control de stock en tiempo real, alertas automáticas, gestión de vencimientos y multi-almacén',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reportes',
      description: 'Reportes completos de ventas, análisis de rentabilidad y proyecciones con IA',
    },
    {
      icon: Users,
      title: 'CRM & Lealtad',
      description: 'Gestión de clientes, programa de puntos, cupones y segmentación automática',
    },
    {
      icon: DollarSign,
      title: 'Finanzas & Contabilidad',
      description: 'Cierre de caja ciego, conciliación bancaria, cuentas por pagar y gestión de gastos',
    },
    {
      icon: Zap,
      title: 'E-commerce & Omnicanal',
      description: 'Tienda online, delivery, retiro en tienda y gestión de suscripciones recurrentes',
    },
  ];

  const businessTypes = [
    'Bodegas',
    'Ferreterías',
    'Restaurantes',
    'Zapaterías',
    'Tiendas de Ropa',
    'Repuestos de Motos',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-white">
              H&I
            </div>
            <h1 className="text-2xl font-bold text-white">H&I POS System</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          El Sistema de POS Más Completo para tu Negocio
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Gestión integral de ventas, inventario, finanzas y más. Compatible con bodegas, ferreterías, restaurantes, zapaterías, tiendas de ropa y repuestos de motos.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 px-8">
              Comenzar Ahora
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8">
            Ver Características
          </Button>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="relative z-10 bg-slate-800/20 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Compatible con</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {businessTypes.map((type) => (
              <div key={type} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg text-center hover:border-cyan-500/50 transition">
                <p className="font-medium text-white">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-white mb-12 text-center">Características Principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition">
                <Icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features List */}
      <section className="relative z-10 bg-slate-800/20 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">Todo lo que Necesitas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Facturación electrónica y comprobantes fiscales',
              'Venta multimoneda con tasas actualizadas',
              'Escaneo de códigos de barras (láser y cámara)',
              'Pantalla de cliente en tiempo real',
              'Caja inteligente con apertura automática',
              'Terminal de pago integrado',
              'Balanza digital sincronizada',
              'Modo offline y sincronización automática',
              'Búsqueda rápida de productos',
              'Suspensión de ventas (dejar en espera)',
              'Control de inventario con alertas de stock',
              'Gestión de lotes y vencimientos',
              'Multi-almacén/sucursales',
              'Transferencias entre tiendas',
              'Trazabilidad completa de productos',
              'Importación desde Excel/CSV',
              'Órdenes de compra automáticas',
              'Recepción con validación de códigos',
              'Cuentas por pagar automatizadas',
              'Análisis de costos promedios',
              'Tienda online sincronizada',
              'Pasarela de pagos integrada',
              'Bot de ventas por WhatsApp',
              'Sistema de delivery con GPS',
              'Programa de lealtad y puntos',
              'Cupones y descuentos',
              'Tarjetas de regalo digitales',
              'Email y SMS marketing',
              'Cierre de caja ciego',
              'Conciliación bancaria automática',
              'Reportes de ventas y rentabilidad',
              'Dashboards interactivos',
              'Control de asistencia',
              'Gestión de turnos',
              'Cálculo automático de comisiones',
              'Auditoría completa de transacciones',
            ].map((feature, index) => (
              <div key={index} className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-cyan-900/20 to-slate-900/20 border border-cyan-500/20 rounded-lg p-12">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para Modernizar tu Negocio?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Crea tu cuenta ahora y comienza a gestionar tu negocio de forma integral
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 px-8">
              Registrarse Gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">H&I POS System</h4>
              <p className="text-sm text-slate-400">
                Propietario: isaac03.24castillo@gmail.com
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Producto</h4>
              <ul className="text-sm space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-cyan-400">Características</Link></li>
                <li><Link href="#" className="hover:text-cyan-400">Precios</Link></li>
                <li><Link href="#" className="hover:text-cyan-400">Documentación</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="text-sm space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-cyan-400">Términos y Condiciones</Link></li>
                <li><Link href="#" className="hover:text-cyan-400">Privacidad</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Soporte</h4>
              <ul className="text-sm space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-cyan-400">Centro de Ayuda</Link></li>
                <li><Link href="#" className="hover:text-cyan-400">Contacto</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2026 H&I POS System. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
