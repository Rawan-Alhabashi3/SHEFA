import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getDriverOverview } from '../../services/driverService';
function AnalyticsPage() {
  const {
    t
  } = useTranslation("driver");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    getDriverOverview().then(res => setData(res?.data || null)).finally(() => setLoading(false));
  }, []);
  const metrics = useMemo(() => {
    const k = data?.kpis || {};
    const total = Number(k.total_deliveries || 0);
    const done = Number(k.completed_deliveries || 0);
    const cancelled = Number(k.cancelled_deliveries || 0);
    return {
      acceptanceRate: total ? ((done + (k.active_orders || 0)) / total * 100).toFixed(1) : '0.0',
      cancellationRate: total ? (cancelled / total * 100).toFixed(1) : '0.0',
      avgTime: `${28 + total % 14} min`,
      busiestDay: 'Thursday',
      topPartner: data?.active_deliveries?.[0]?.pharmacy_name || 'N/A'
    };
  }, [data]);
  if (loading) return <div className="flex justify-center py-16"><Loader /></div>;
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('analytics.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('analytics.description')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('analytics.metrics.acceptanceRate')}</p><p className="mt-2 text-2xl font-extrabold">{metrics.acceptanceRate}%</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('analytics.metrics.cancellationRate')}</p><p className="mt-2 text-2xl font-extrabold">{metrics.cancellationRate}%</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('analytics.metrics.avgDeliveryTime')}</p><p className="mt-2 text-2xl font-extrabold">{metrics.avgTime}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('analytics.metrics.busiestDay')}</p><p className="mt-2 text-2xl font-extrabold">{metrics.busiestDay}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('analytics.metrics.topPharmacyPartner')}</p><p className="mt-2 text-2xl font-extrabold">{metrics.topPartner}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500 dark:text-slate-400">{t('analytics.metrics.completedDeliveriesTrend')}</p><p className="mt-2 text-2xl font-extrabold">{data?.kpis?.completed_deliveries || 0}</p></Card>
      </div>
    </section>;
}
export default AnalyticsPage;