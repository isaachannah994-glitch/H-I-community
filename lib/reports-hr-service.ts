import { ref, get, set, update } from 'firebase/database';
import { database } from './firebase';
import {
  SalesReport,
  ProductReport,
  FinancialReport,
  Employee,
  AttendanceRecord,
  EmployeeShift,
  EmployeeCommission,
} from './types';
import { getAllSales, getSale } from './pos-service';
import { getAllProducts } from './pos-service';
import { getSalesByDateRange } from './pos-service';

// ============================================================================
// GENERACIÓN DE REPORTES DE VENTAS
// ============================================================================

export async function generateSalesReport(
  businessId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly',
  startDate: number,
  endDate: number
): Promise<SalesReport> {
  try {
    const sales = await getSalesByDateRange(businessId, startDate, endDate);
    
    const totalSales = sales.filter(s => s.status === 'completed').length;
    const totalRevenue = sales.reduce((sum, s) => s.status === 'completed' ? sum + s.total : sum, 0);
    
    const products = await getAllProducts(businessId);
    const totalCost = sales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId);
        return itemSum + ((product?.costPrice || 0) * item.quantity);
      }, 0);
    }, 0);

    const totalProfit = totalRevenue - totalCost;
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    const topProducts = sales
      .flatMap(s => s.items)
      .reduce((acc: any, item) => {
        const existing = acc.find((p: any) => p.productId === item.productId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.quantity * item.price;
        } else {
          acc.push({ productId: item.productId, quantity: item.quantity, revenue: item.quantity * item.price });
        }
        return acc;
      }, [])
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    const topCategories = sales
      .flatMap(s => s.items)
      .reduce((acc: any, item) => {
        const product = products.find(p => p.id === item.productId);
        const category = product?.category || 'Unknown';
        const existing = acc.find((c: any) => c.category === category);
        if (existing) {
          existing.revenue += item.quantity * item.price;
        } else {
          acc.push({ category, revenue: item.quantity * item.price });
        }
        return acc;
      }, [])
      .sort((a: any, b: any) => b.revenue - a.revenue);

    const reportId = `sr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const report: SalesReport = {
      id: reportId,
      businessId,
      period,
      startDate,
      endDate,
      totalSales,
      totalRevenue,
      totalCost,
      totalProfit,
      totalTransactions: sales.length,
      averageTicket,
      topProducts,
      topCategories,
    };

    await set(ref(database, `businesses/${businessId}/reports/sales/${reportId}`), report);
    return report;
  } catch (error) {
    console.error('Error generating sales report:', error);
    return {} as SalesReport;
  }
}

export async function generateProductReport(
  businessId: string,
  productId: string,
  period: 'daily' | 'weekly' | 'monthly',
  startDate: number,
  endDate: number
): Promise<ProductReport> {
  try {
    const sales = await getSalesByDateRange(businessId, startDate, endDate);
    
    const product = await get(ref(database, `businesses/${businessId}/products/${productId}`));
    const productData = product.val();

    const productSales = sales
      .flatMap(s => s.items.filter(item => item.productId === productId))
      .filter(item => item !== undefined);

    const unitsSold = productSales.reduce((sum, item) => sum + item.quantity, 0);
    const revenue = productSales.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const cost = unitsSold * (productData?.costPrice || 0);
    const profit = revenue - cost;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    const reportId = `pr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const report: ProductReport = {
      id: reportId,
      businessId,
      productId,
      period,
      startDate,
      endDate,
      unitsSold,
      revenue,
      cost,
      profit,
      profitMargin,
      stockMovement: 0,
    };

    await set(ref(database, `businesses/${businessId}/reports/products/${reportId}`), report);
    return report;
  } catch (error) {
    console.error('Error generating product report:', error);
    return {} as ProductReport;
  }
}

export async function generateFinancialReport(
  businessId: string,
  period: 'monthly' | 'quarterly' | 'yearly',
  date: number
): Promise<FinancialReport> {
  try {
    // Calcular periodos
    const startDate = period === 'monthly' 
      ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
      : period === 'quarterly'
      ? new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1).getTime()
      : new Date(new Date().getFullYear(), 0, 1).getTime();

    const endDate = Date.now();

    const sales = await getSalesByDateRange(businessId, startDate, endDate);
    const totalRevenue = sales.reduce((sum, s) => s.status === 'completed' ? sum + s.total : sum, 0);

    const expenses = await get(ref(database, `businesses/${businessId}/expenses`));
    const expensesData = expenses.exists() ? Object.values(expenses.val()) as any[] : [];
    const totalExpenses = expensesData
      .filter(e => e.date >= startDate && e.date <= endDate)
      .reduce((sum, e) => sum + e.amount, 0);

    const grossProfit = totalRevenue - totalExpenses;
    const netProfit = grossProfit; // Simplificado, en producción incluiría más cálculos

    const reportId = `fr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const report: FinancialReport = {
      id: reportId,
      businessId,
      period,
      date,
      totalRevenue,
      totalExpenses,
      grossProfit,
      netProfit,
      cashFlow: grossProfit,
    };

    await set(ref(database, `businesses/${businessId}/reports/financial/${reportId}`), report);
    return report;
  } catch (error) {
    console.error('Error generating financial report:', error);
    return {} as FinancialReport;
  }
}

// ============================================================================
// GESTIÓN DE EMPLEADOS (HR)
// ============================================================================

export async function createEmployee(businessId: string, employee: Omit<Employee, 'id' | 'createdAt'>) {
  try {
    const employeeId = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newEmployee: Employee = {
      ...employee,
      id: employeeId,
      createdAt: Date.now(),
      documents: [],
    };

    await set(ref(database, `businesses/${businessId}/employees/${employeeId}`), newEmployee);
    return { success: true, employeeId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getEmployee(businessId: string, employeeId: string): Promise<Employee | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/employees/${employeeId}`));
    return snapshot.exists() ? (snapshot.val() as Employee) : null;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
}

export async function getAllEmployees(businessId: string): Promise<Employee[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/employees`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as Employee[];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function updateEmployee(businessId: string, employeeId: string, updates: Partial<Employee>) {
  try {
    await update(ref(database, `businesses/${businessId}/employees/${employeeId}`), updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// CONTROL DE ASISTENCIA
// ============================================================================

export async function recordCheckIn(
  businessId: string,
  employeeId: string,
  method: 'biometric' | 'pin' | 'manual'
) {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const attendanceId = `att_${today}_${employeeId}`;

    const snapshot = await get(ref(database, `businesses/${businessId}/attendance/${attendanceId}`));
    
    if (snapshot.exists()) {
      const existing = snapshot.val() as AttendanceRecord;
      if (existing.checkIn) {
        return { success: false, error: 'Already checked in today' };
      }
    }

    const record: AttendanceRecord = {
      id: attendanceId,
      businessId,
      employeeId,
      date: today,
      checkIn: Date.now(),
      hoursWorked: 0,
      status: 'present',
    };

    await set(ref(database, `businesses/${businessId}/attendance/${attendanceId}`), record);
    return { success: true, attendanceId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function recordCheckOut(businessId: string, attendanceId: string) {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/attendance/${attendanceId}`));
    if (!snapshot.exists()) throw new Error('Attendance record not found');

    const record = snapshot.val() as AttendanceRecord;
    if (!record.checkIn) throw new Error('Employee has not checked in');

    const hoursWorked = (Date.now() - record.checkIn) / (1000 * 60 * 60);

    await update(ref(database, `businesses/${businessId}/attendance/${attendanceId}`), {
      checkOut: Date.now(),
      hoursWorked,
    });

    return { success: true, hoursWorked };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAttendanceRecords(businessId: string, employeeId?: string): Promise<AttendanceRecord[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/attendance`));
    if (!snapshot.exists()) return [];

    const records = Object.values(snapshot.val()) as AttendanceRecord[];
    return employeeId ? records.filter(r => r.employeeId === employeeId) : records;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return [];
  }
}

// ============================================================================
// GESTIÓN DE TURNOS
// ============================================================================

export async function createShift(businessId: string, shift: Omit<EmployeeShift, 'id'>) {
  try {
    const shiftId = `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newShift: EmployeeShift = {
      ...shift,
      id: shiftId,
    };

    await set(ref(database, `businesses/${businessId}/shifts/${shiftId}`), newShift);
    return { success: true, shiftId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getShifts(businessId: string, employeeId?: string): Promise<EmployeeShift[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/shifts`));
    if (!snapshot.exists()) return [];

    const shifts = Object.values(snapshot.val()) as EmployeeShift[];
    return employeeId ? shifts.filter(s => s.employeeId === employeeId) : shifts;
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return [];
  }
}

// ============================================================================
// CÁLCULO DE COMISIONES
// ============================================================================

export async function calculateCommission(
  businessId: string,
  employeeId: string,
  period: number
): Promise<EmployeeCommission | null> {
  try {
    const sales = await getAllSales(businessId);
    const employeeSales = sales.filter(s => s.cashier === employeeId && s.issuedAt >= period);

    const totalSalesAmount = employeeSales.reduce((sum, s) => sum + s.total, 0);
    const commissionAmount = totalSalesAmount * 0.05; // 5% comisión

    const employee = await getEmployee(businessId, employeeId);
    if (!employee) throw new Error('Employee not found');

    const commission: EmployeeCommission = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      businessId,
      employeeId,
      period,
      baseSalary: employee.salary || 0,
      commissionAmount,
      deductions: 0,
      totalPayment: (employee.salary || 0) + commissionAmount,
      status: 'pending',
    };

    return commission;
  } catch (error) {
    console.error('Error calculating commission:', error);
    return null;
  }
}
