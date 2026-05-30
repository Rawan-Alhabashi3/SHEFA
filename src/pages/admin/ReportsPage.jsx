import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/format';
import { getAdminOverview } from '../../services/adminService';
function ReportsPage() {
  const {
    t
  } = useTranslation("admin");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAdminOverview().then(response => setData(response?.data || null)).finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="flex justify-center py-14"><Loader /></div>;
  const kpis = data?.kpis || {};
  const alerts = data?.sections?.system_alerts || [];
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('reports.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('reports.description')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('reports.kpis.totalRevenue')}</p><p className="mt-2 text-2xl font-extrabold">{formatPrice(kpis.total_revenue || 0)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('reports.kpis.monthlyRevenue')}</p><p className="mt-2 text-2xl font-extrabold">{formatPrice(kpis.monthly_revenue || 0)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('reports.kpis.conversionRate')}</p><p className="mt-2 text-2xl font-extrabold">{Number(kpis.conversion_rate || 0).toFixed(1)}%</p></Card>
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('reports.sections.systemAlerts')}</h3>
        <div className="mt-3 space-y-2">
          {alerts.map(alert => <div key={alert.id} className="rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">{alert.message}</div>)}
        </div>
      </Card>
    </section>;
}
export default ReportsPage;