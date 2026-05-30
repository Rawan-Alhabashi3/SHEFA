import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/format';
import { getAdminOverview } from '../../services/adminService';
import StatusBadge from '../../components/admin/StatusBadge';
const pieColors = ['#2563eb', '#16a34a', '#f59e0b', '#9333ea', '#e11d48', '#64748b'];
function AdminDashboardPage() {
  const {
    t
  } = useTranslation("admin");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    getAdminOverview().then(response => setData(response?.data || null)).catch(err => setError(err?.response?.data?.message || t('errors.failedToLoadDashboard'))).finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <div className="flex justify-center py-16"><Loader /></div>;
  }
  if (error) {
    return <p className="rounded-xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</p>;
  }
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const sections = data?.sections || {};
  const cards = [[t('dashboard.kpis.totalUsers'), kpis.total_users], [t('dashboard.kpis.totalPharmacies'), kpis.total_pharmacies], [t('dashboard.kpis.totalOrders'), kpis.total_orders], [t('dashboard.kpis.totalRevenue'), formatPrice(kpis.total_revenue || 0)], [t('dashboard.kpis.activeDeliveries'), kpis.active_deliveries], [t('dashboard.kpis.pendingOrders'), kpis.pending_orders], [t('dashboard.kpis.totalMedicines'), kpis.total_medicines], [t('dashboard.kpis.platformGrowth'), `${Number(kpis.platform_growth || 0).toFixed(1)}%`], [t('dashboard.kpis.monthlyRevenue'), formatPrice(kpis.monthly_revenue || 0)], [t('dashboard.kpis.conversionRate'), `${Number(kpis.conversion_rate || 0).toFixed(1)}%`]];
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('dashboard.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('dashboard.description')}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => <Card key={label} className="p-4 ring-1 ring-slate-200 dark:ring-slate-700/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">{value ?? 0}</p>
          </Card>)}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.revenueLast12Months')}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthly_revenue || []}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total" stroke="#2563eb" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.ordersLast30Days')}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.orders_last_30_days || []}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.ordersByStatus')}</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.orders_by_status || []} dataKey="total" nameKey="status" outerRadius={96} label>
                  {(charts.orders_by_status || []).map((entry, idx) => <Cell key={entry.status} fill={pieColors[idx % pieColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.paymentMethodsDistribution')}</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.payment_methods || []}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#9333ea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.topSellingMedicines')}</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(charts.top_medicines || []).slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold_qty" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.sections.latestOrders')}</h3>
          <div className="space-y-2">
            {(sections.latest_orders || []).slice(0, 6).map(order => <div key={order.id} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('common.orderHash')}{order.id}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{order.customer_name} · {order.pharmacy?.pharmacy_name || t('common.pharmacy')}</p>
                </div>
                <StatusBadge value={order.order_status} />
              </div>)}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.sections.notificationsCenter')}</h3>
          <div className="space-y-2">
            {(sections.notifications || []).slice(0, 6).map(item => <div key={item.id} className="rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.message || t('dashboard.sections.noAdditionalMessage')}</p>
              </div>)}
          </div>
        </Card>
      </div>
    </section>;
}
export default AdminDashboardPage;