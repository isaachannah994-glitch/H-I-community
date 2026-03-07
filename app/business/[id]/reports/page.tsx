'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { generateSalesReport, generateFinancialReport } from '@/lib/reports-hr-service';
import { getSalesByDateRange } from '@/lib/pos-service';
import { Sale } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowLeft, Loader, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ReportsPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    averageTicket: 0,
  });

  useEffect(() => {
    loadReport();
  }, [businessId, period]);

  const loadReport = async () => {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'daily':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'weekly':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'monthly':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 12);
          break;
        case 'yearly':
          startDate = new Date(now);
          startDate.setFullYear(startDate.getFullYear() - 5);
          break;
      }

      const salesData = await getSalesByDateRange(businessId, startDate.getTime(), now.getTime());
      setSales(salesData);

      // Procesar datos para gráficos
      const groupedData = processSalesData(salesData, period);
      setChartData(groupedData);

      // Calcular totales
      const completed = salesData.filter(s => s.status === 'completed');
      const revenue = completed.reduce((sum, s) => sum + s.total, 0);
      setTotals({
        totalSales: completed.length,
        totalRevenue: revenue,
        totalTransactions: salesData.length,
        averageTicket: completed.length > 0 ? revenue / completed.length : 0,
      });

      await generateSalesReport(businessId, period, startDate.getTime(), now.getTime());
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const processSalesData = (salesData: Sale[], period: string) => {
    const grouped: { [key: string]: number } = {};

    salesData.forEach(sale => {
      const date = new Date(sale.issuedAt);
      let key = '';

      switch (period) {
        case 'daily':
          key = date.toLocaleDateString();
          break;
        case 'weekly':
          const week = Math.ceil(date.getDate() / 7);
          key = `Sem ${week}`;
          break;
        case 'monthly':
          key = date.toLocaleString('es', { month: 'short' });
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
      }

      grouped[key] = (grouped[key] || 0) + sale.total;
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  };

  const topProducts = sales
    .flatMap(s => s.items)
    .reduce((acc: any, item) => {
      const existing = acc.find((p: any) => p.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.quantity * item.price;
      } else {
        acc.push({
          productId: item.productId,
          quantity: item.quantity,
          revenue: item.quantity * item.price,
        });
      }
      return acc;
    }, [])
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p: any) => ({ name: `Prod ${p.productId.slice(0, 8)}`, value: p.revenue }));

  const paymentMethods = sales
    .filter(s => s.status === 'completed')
    .reduce((acc: any, sale) => {
      const existing = acc.find((p: any) => p.name === sale.paymentMethod);
      if (existing) {
        existing.value += sale.total;
      } else {
        acc.push({ name: sale.paymentMethod, value: sale.total });
      }
      return acc;
    }, []);

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
            <h1 className="text-3xl font-bold">Reportes y Analytics</h1>
            <div className="flex gap-2">
              <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Últimos 7 días</SelectItem>
                  <SelectItem value="weekly">Últimos 30 días</SelectItem>
                  <SelectItem value="monthly">Últimos 12 meses</SelectItem>
                  <SelectItem value="yearly">Últimos 5 años</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Ventas Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.totalSales}</div>
              <p className="text-xs text-muted-foreground">transacciones exitosas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Ingresos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">en el período</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals.averageTicket.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">por venta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transacciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">todas las</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Ingresos ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Métodos de Pago */}
          {paymentMethods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" name="Ingresos ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
