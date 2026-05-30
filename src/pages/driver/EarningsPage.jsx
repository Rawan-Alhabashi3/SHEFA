import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getDriverEarnings } from '../../services/driverService';
import { formatPrice } from '../../utils/format';
const colors = ['#16a34a', '#e11d48', '#2563eb'];
function EarningsPage() {
  const {
    t
  } = useTranslation("driver");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    getDriverEarnings().then(res => setData(res?.data || null)).finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="flex justify-center py-16"><Loader /></div>;
  const cards = data?.cards || {};
  const charts = data?.charts || {};
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('earnings.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('earnings.description')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4"><p className="text-xs text-slate-500 dark:text-slate-400">{t('earnings.cards.todayEarnings')}</p><p className="mt-2 text-xl font-bold">{formatPrice(cards.today || 0)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 dark:text-slate-400">{t('earnings.cards.weeklyEarnings')}</p><p className="mt-2 text-xl font-bold">{formatPrice(cards.weekly || 0)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 dark:text-slate-400">{t('earnings.cards.monthlyEarnings')}</p><p className="mt-2 text-xl font-bold">{formatPrice(cards.monthly || 0)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 dark:text-slate-400">{t('earnings.cards.totalEarnings')}</p><p className="mt-2 text-xl font-bold">{formatPrice(cards.total || 0)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 dark:text-slate-400">{t('earnings.cards.avgDeliveryFee')}</p><p className="mt-2 text-xl font-bold">{formatPrice(cards.avg_delivery_fee || 0)}</p></Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4"><h3 className="mb-3 text-sm font-semibold">{t('earnings.charts.earningsLast7Days')}</h3><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={charts.earnings_last_7_days || []}><CartesianGrid strokeDasharray="4 4" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Legend /><Area dataKey="amount" stroke="#2563eb" fill="#bfdbfe" /></AreaChart></ResponsiveContainer></div></Card>
        <Card className="p-4"><h3 className="mb-3 text-sm font-semibold">{t('earnings.charts.monthlyRevenue')}</h3><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={charts.monthly_revenue || []}><CartesianGrid strokeDasharray="4 4" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line dataKey="amount" stroke="#16a34a" strokeWidth={2.5} /></LineChart></ResponsiveContainer></div></Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4"><h3 className="mb-3 text-sm font-semibold">{t('earnings.charts.deliveriesPerDay')}</h3><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={charts.deliveries_per_day || []}><CartesianGrid strokeDasharray="4 4" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Legend /><Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card className="p-4"><h3 className="mb-3 text-sm font-semibold">{t('earnings.charts.deliverySuccessRate')}</h3><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={charts.success_rate || []} dataKey="value" nameKey="name" outerRadius={96}>{(charts.success_rate || []).map((entry, idx) => <Cell key={entry.name} fill={colors[idx % colors.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></Card>
      </div>
    </section>;
}
export default EarningsPage;