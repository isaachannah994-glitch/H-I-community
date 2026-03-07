'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getExpenses, getAccountsPayable, getAccountsReceivable } from '@/lib/crm-finance-service';
import { OperatingExpense, AccountsPayable, AccountsReceivable } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function FinancesPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [expenses, setExpenses] = useState<OperatingExpense[]>([]);
  const [payables, setPayables] = useState<AccountsPayable[]>([]);
  const [receivables, setReceivables] = useState<AccountsReceivable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [businessId]);

  const loadData = async () => {
    try {
      const [exps, pays, recs] = await Promise.all([
        getExpenses(businessId),
        getAccountsPayable(businessId),
        getAccountsReceivable(businessId),
      ]);

      setExpenses(exps);
      setPayables(pays);
      setReceivables(recs);
    } catch (err) {
      console.error('Error loading financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPayable = payables.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);
  const totalReceivable = receivables.reduce((sum, r) => sum + (r.amount - r.paidAmount), 0);

  const expensesByCategory = expenses.reduce((acc: any, exp) => {
    const existing = acc.find((e: any) => e.name === exp.category);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: exp.category, value: exp.amount });
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
          <h1 className="text-3xl font-bold">Gestión Financiera</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                Gastos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">en gastos operativos</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                Por Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${totalPayable.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">a proveedores</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Por Cobrar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalReceivable.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">de clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {expensesByCategory.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expensesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" name="Gastos ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="expenses">Gastos ({expenses.length})</TabsTrigger>
            <TabsTrigger value="payables">Por Pagar ({payables.length})</TabsTrigger>
            <TabsTrigger value="receivables">Por Cobrar ({receivables.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            {expenses.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">Sin gastos registrados</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead>Método de Pago</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payables">
            {payables.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">Sin cuentas por pagar</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proveedor</TableHead>
                      <TableHead className="text-right">Monto Total</TableHead>
                      <TableHead className="text-right">Pagado</TableHead>
                      <TableHead className="text-right">Pendiente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Vencimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payables.map((payable) => {
                      const pending = payable.amount - payable.paidAmount;
                      const isOverdue = payable.dueDate < Date.now();
                      
                      return (
                        <TableRow key={payable.id}>
                          <TableCell>{payable.supplierId}</TableCell>
                          <TableCell className="text-right">
                            ${payable.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${payable.paidAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${pending.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={payable.status === 'paid' ? 'default' : 'outline'}
                              className={
                                payable.status === 'paid' 
                                  ? 'bg-green-600' 
                                  : isOverdue 
                                  ? 'border-red-600 text-red-600'
                                  : ''
                              }
                            >
                              {payable.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(payable.dueDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="receivables">
            {receivables.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">Sin cuentas por cobrar</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Monto Total</TableHead>
                      <TableHead className="text-right">Pagado</TableHead>
                      <TableHead className="text-right">Pendiente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Vencimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivables.map((receivable) => {
                      const pending = receivable.amount - receivable.paidAmount;
                      const isOverdue = receivable.dueDate < Date.now();
                      
                      return (
                        <TableRow key={receivable.id}>
                          <TableCell>{receivable.customerId}</TableCell>
                          <TableCell className="text-right">
                            ${receivable.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${receivable.paidAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${pending.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={receivable.status === 'paid' ? 'default' : 'outline'}
                              className={
                                receivable.status === 'paid'
                                  ? 'bg-green-600'
                                  : isOverdue
                                  ? 'border-red-600 text-red-600'
                                  : ''
                              }
                            >
                              {receivable.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(receivable.dueDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
