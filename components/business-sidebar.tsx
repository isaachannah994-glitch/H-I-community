import Link from 'next/link';
import { Button } from './button';
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  DollarSign,
  Truck,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  businessId: string;
  onLogout?: () => void;
}

export function BusinessSidebar({ businessId, onLogout }: SidebarProps) {
  const menuItems = [
    {
      label: 'Panel Principal',
      href: `/business/${businessId}`,
      icon: ShoppingCart,
    },
    {
      label: 'Punto de Venta',
      href: `/business/${businessId}/pos`,
      icon: ShoppingCart,
    },
    {
      label: 'Productos',
      href: `/business/${businessId}/products`,
      icon: Package,
    },
    {
      label: 'Inventario',
      href: `/business/${businessId}/inventory`,
      icon: Package,
    },
    {
      label: 'Compras',
      href: `/business/${businessId}/purchases`,
      icon: Truck,
    },
    {
      label: 'Clientes',
      href: `/business/${businessId}/customers`,
      icon: Users,
    },
    {
      label: 'Reportes',
      href: `/business/${businessId}/reports`,
      icon: BarChart3,
    },
    {
      label: 'Finanzas',
      href: `/business/${businessId}/finances`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="w-64 border-r bg-card min-h-screen p-4 space-y-4">
      <div className="pb-4 border-b">
        <h2 className="font-bold text-lg">Menú</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <div>
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {onLogout && (
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      )}
    </div>
  );
}
