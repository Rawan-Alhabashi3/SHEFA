import { useTranslation } from "react-i18next";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { Banknote, Boxes, ClipboardList, PackageX, Star, Truck, Undo2 } from 'lucide-react';
import DashboardStatCard from '../../components/common/DashboardStatCard';
import ChartCard from '../../components/pharmacy/ChartCard';
import Card from '../../components/common/Card';
import { getPharmacyAnalytics } from '../../services/pharmacyService';
import { formatPrice } from '../../utils/format';
const statusColors = {
  delivered: '#16a34a',
  pending: '#f59e0b',
  preparing: '#2563eb',
  ready_for_pickup: '#16a34a',
  in_delivery: '#2563eb',
  cancelled: '#e11d48',
  rejected: '#e11d48'
};
const shortDate = value => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric'
}).format(new Date(value));
const compactCurrency = value => new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(Number(value || 0));
function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = value => value
}) {
  const {
    t
  } = useTranslation("pharmacy");
  if (!active || !payload?.length) return null;
  return <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs shadow-lg">
      {label ? <p className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{label}</p> : null}
      {payload.map(entry => <div key={`${entry.name}-${entry.dataKey || entry.value}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full" style={{
        backgroundColor: entry.color || entry.fill
      }} />
          <span>{entry.name}: </span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{valueFormatter(entry.value, entry)}</span>
        </div>)}
    </div>;
}
function PharmacyDashboardPage() {
  const {
    t
  } = useTranslation("pharmacy");
  const statusLabels = {
    delivered: t('dashboard.statusLabels.delivered'),
    pending: t('dashboard.statusLabels.pending'),
    preparing: t('dashboard.statusLabels.preparing'),
    ready_for_pickup: t('dashboard.statusLabels.ready_for_pickup'),
    in_delivery: t('dashboard.statusLabels.in_delivery'),
    cancelled: t('dashboard.statusLabels.cancelled'),
    rejected: t('dashboard.statusLabels.rejected')
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    getPharmacyAnalytics().then(res => {
      if (!mounted) return;
      setData(res?.data || null);
    }).catch(err => {
      if (!mounted) return;
      setError(err?.response?.data?.message || t('dashboard.errors.failedToLoadAnalytics'));
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [t]);
  const cards = data?.cards || {};
  const timeseries = data?.timeseries || [];
  const statusRows = data?.orders_by_status || [];
  const topMeds = data?.top_medicines || [];
  const chartData = useMemo(() => timeseries.map(item => ({
    label: shortDate(item.day),
    orders: Number(item.orders || 0),
    revenue: Number(item.revenue || 0)
  })), [timeseries]);
  const statusChart = useMemo(() => statusRows.map(row => ({
    name: statusLabels[row.order_status] || row.order_status,
    status: row.order_status,
    value: Number(row.count || 0),
    fill: statusColors[row.order_status] || '#64748b'
  })), [statusRows]);
  const topMedsChart = useMemo(() => topMeds.map(medicine => ({
    name: medicine.name,
    sold: Number(medicine.sold_qty || 0),
    revenue: Number(medicine.revenue_total || 0),
    frequency: Number(medicine.order_frequency || 0)
  })), [topMeds]);
  return <section>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('dashboard.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('dashboard.description')}</p>
        </div>
      </div>

      {error ? <Card className="mb-4 p-5 ring-1 ring-rose-100">
          <p className="text-sm text-rose-700 dark:text-rose-200">{error}</p>
        </Card> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard icon={ClipboardList} label={t('dashboard.cards.totalOrders')} value={loading ? '-' : cards.total_orders ?? 0} />
        <DashboardStatCard icon={Banknote} label={t('dashboard.cards.totalRevenue')} value={loading ? '-' : formatPrice(cards.total_revenue || 0)} />
        <DashboardStatCard icon={Truck} label={t('dashboard.cards.activeDeliveries')} value={loading ? '-' : cards.active_deliveries ?? 0} />
        <DashboardStatCard icon={Boxes} label={t('dashboard.cards.totalMedicines')} value={loading ? '-' : cards.total_medicines ?? 0} />
        <DashboardStatCard icon={Undo2} label={t('dashboard.cards.pendingOrders')} value={loading ? '-' : cards.pending_orders ?? 0} />
        <DashboardStatCard icon={PackageX} label={t('dashboard.cards.outOfStock')} value={loading ? '-' : cards.out_of_stock ?? 0} />
        <DashboardStatCard icon={Star} label={t('dashboard.cards.averageRating')} value={loading ? '-' : Number(cards.avg_rating || 0).toFixed(1)} hint={`${cards.reviews_count || 0} ${t('dashboard.reviews')}`} />
        <DashboardStatCard icon={ClipboardList} label={t('dashboard.cards.completedOrders')} value={loading ? '-' : cards.completed_orders ?? 0} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartCard title={t('dashboard.charts.ordersLast14Days')} loading={loading} isEmpty={!chartData.length}>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{
            top: 12,
            right: 18,
            left: 0,
            bottom: 8
          }}>
              <defs>
                <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#64748b'
            }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#64748b'
            }} width={34} />
              <Tooltip content={<ChartTooltip valueFormatter={value => `${value} ${t('dashboard.orders')}`} />} />
              <Legend iconType="circle" wrapperStyle={{
              fontSize: 12,
              paddingTop: 6
            }} />
              <Area type="monotone" dataKey="orders" name={t('dashboard.charts.orders')} stroke="#2563eb" fill="url(#ordersFill)" strokeWidth={3} activeDot={{
              r: 5
            }} isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.charts.revenueLast14Days')} loading={loading} isEmpty={!chartData.length}>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{
            top: 12,
            right: 18,
            left: 2,
            bottom: 8
          }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#64748b'
            }} />
              <YAxis axisLine={false} tickFormatter={compactCurrency} tickLine={false} tick={{
              fontSize: 12,
              fill: '#64748b'
            }} width={56} />
              <Tooltip content={<ChartTooltip valueFormatter={value => formatPrice(value)} />} />
              <Legend iconType="circle" wrapperStyle={{
              fontSize: 12,
              paddingTop: 6
            }} />
              <Line type="monotone" dataKey="revenue" name={t('dashboard.charts.revenue')} stroke="#16a34a" strokeWidth={3} dot={{
              r: 3
            }} activeDot={{
              r: 6
            }} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartCard title={t('dashboard.charts.ordersByStatus')} loading={loading} isEmpty={!statusChart.length} emptyText={t('dashboard.emptyStates.noOrderStatusData')}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{
            top: 4,
            right: 4,
            left: 4,
            bottom: 4
          }}>
              <Pie data={statusChart} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={68} outerRadius={105} paddingAngle={3} label={({
              name,
              percent
            }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} isAnimationActive>
                {statusChart.map(entry => <Cell key={entry.status} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<ChartTooltip valueFormatter={value => `${value} orders`} />} />
              <Legend iconType="circle" wrapperStyle={{
              fontSize: 12,
              paddingTop: 4
            }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.charts.topSellingMedicines')} loading={loading} isEmpty={!topMedsChart.length} emptyText={t('dashboard.emptyStates.noMedicineSales')}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topMedsChart} layout="vertical" margin={{
            top: 8,
            right: 26,
            left: 22,
            bottom: 8
          }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#64748b'
            }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#334155'
            }} width={126} />
              <Tooltip content={<ChartTooltip valueFormatter={(value, entry) => entry.dataKey === 'sold' ? `${value} ${t('dashboard.units')}` : formatPrice(value)} />} />
              <Legend iconType="circle" wrapperStyle={{
              fontSize: 12,
              paddingTop: 6
            }} />
              <Bar dataKey="sold" name={t('dashboard.charts.unitsSold')} fill="#2563eb" radius={[0, 8, 8, 0]} barSize={18} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>;
}
export default PharmacyDashboardPage;