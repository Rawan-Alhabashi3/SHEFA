import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import DriverStatusBadge from '../../components/driver/DriverStatusBadge';
import { getDriverMissions } from '../../services/driverService';
function DriverHistoryPage() {
  const {
    t
  } = useTranslation("driver");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const load = async () => {
    setLoading(true);
    const res = await getDriverMissions('completed');
    setRecords(res?.data || []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  return <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('history.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('history.description')}</p>
        </div>
        <button type="button" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">{t('history.buttons.export')}</button>
      </div>

      <Card className="overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Loader /></div> : <div className="overflow-x-auto">
            <table className="min-w-full text-start text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">{t('history.table.mission')}</th>
                  <th className="px-4 py-3">{t('history.table.orders')}</th>
                  <th className="px-4 py-3">{t('history.table.status')}</th>
                  <th className="px-4 py-3">{t('history.table.destination')}</th>
                  <th className="px-4 py-3">{t('history.table.date')}</th>
                </tr>
              </thead>
              <tbody>
                {(records || []).map(row => <tr key={row.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">#{row.id}</td>
                    <td className="px-4 py-3">{(row.orders || []).length}</td>
                    <td className="px-4 py-3"><DriverStatusBadge status={row.status} /></td>
                    <td className="px-4 py-3">{row.address}</td>
                    <td className="px-4 py-3">{new Date(row.updated_at || row.created_at).toLocaleString()}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>}
      </Card>
    </section>;
}
export default DriverHistoryPage;