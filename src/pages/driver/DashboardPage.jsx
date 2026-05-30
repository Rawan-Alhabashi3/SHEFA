import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Banknote, CheckCircle2, Clock3, PackageCheck, Truck, TrendingUp, UserRoundCheck, XCircle } from 'lucide-react';
import DashboardStatCard from '../../components/common/DashboardStatCard';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import DriverStatusBadge from '../../components/driver/DriverStatusBadge';
import { getDriverOverview, updateDriverAvailability } from '../../services/driverService';
import { formatPrice } from '../../utils/format';
function DriverDashboardPage() {
  const {
    t
  } = useTranslation("driver");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getDriverOverview();
      setData(response?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || t('dashboard.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const onModeChange = async mode => {
    await updateDriverAvailability({
      availability_mode: mode
    });
    await load();
  };
  if (loading) return <div className="flex justify-center py-16"><Loader /></div>;
  if (error) return <p className="rounded-xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</p>;
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const active = data?.active_missions || data?.active_deliveries || [];
  return <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('dashboard.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('dashboard.description')}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
          {['online', 'busy', 'offline'].map(mode => <button key={mode} type="button" onClick={() => onModeChange(mode)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${kpis.status === mode ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {t(`dashboard.status.${mode}`)}
            </button>)}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard icon={Truck} label={t('dashboard.cards.totalMissions')} value={kpis.total_missions ?? kpis.total_deliveries ?? 0} />
        <DashboardStatCard icon={Clock3} label={t('dashboard.cards.activeMissions')} value={kpis.active_missions ?? kpis.active_orders ?? 0} />
        <DashboardStatCard icon={PackageCheck} label={t('dashboard.cards.pendingTasks')} value={kpis.pending_tasks ?? kpis.available_missions ?? 0} />
        <DashboardStatCard icon={CheckCircle2} label={t('dashboard.cards.completedMissions')} value={kpis.completed_missions ?? kpis.completed_deliveries ?? 0} />
        <DashboardStatCard icon={XCircle} label={t('dashboard.cards.cancelledMissions')} value={kpis.cancelled_missions ?? kpis.cancelled_deliveries ?? 0} />
        <DashboardStatCard icon={Banknote} label={t('dashboard.cards.todayEarnings')} value={formatPrice(kpis.today_earnings || 0)} className="bg-gradient-to-r from-blue-50 to-cyan-50" />
        <DashboardStatCard icon={TrendingUp} label={t('dashboard.cards.monthlyEarnings')} value={formatPrice(kpis.monthly_earnings || 0)} className="bg-gradient-to-r from-indigo-50 to-blue-50" />
        <DashboardStatCard icon={UserRoundCheck} label={t('dashboard.cards.averageRating')} value={kpis.average_rating || 0} hint="Customer satisfaction score" />
        <DashboardStatCard icon={PackageCheck} label={t('dashboard.cards.onlineOfflineStatus')} value={<DriverStatusBadge status={kpis.status || 'offline'} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.earningsLast7Days')}</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.earnings_last_7_days || []}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area dataKey="value" stroke="#2563eb" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.missionsPerDay')}</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.deliveries_per_day || []}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.monthlyRevenue')}</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.monthly_revenue || []}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="total" stroke="#7c3aed" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.charts.activeMissions')}</h3>
        <div className="space-y-2">
          {active.slice(0, 4).map(item => <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.mission_id ? `${t('orders.mission.missionNumber')}${item.mission_id}` : item.order_id || `${t('orders.mission.missionNumber')}${item.id}`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.customer_name} - {item.address || item.pharmacy_name || ''}
                </p>
              </div>
              <DriverStatusBadge status={item.status || item.order_status} />
            </div>)}
        </div>
      </Card>
    </section>;
}
export default DriverDashboardPage;