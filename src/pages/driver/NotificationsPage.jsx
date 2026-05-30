import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import DriverStatusBadge from '../../components/driver/DriverStatusBadge';
import { getDriverNotifications, markDriverNotificationRead } from '../../services/driverService';
function DriverNotificationsPage() {
  const {
    t
  } = useTranslation("driver");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const load = async () => {
    setLoading(true);
    const res = await getDriverNotifications();
    setItems(res?.data?.data || []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  const onRead = async id => {
    await markDriverNotificationRead(id);
    await load();
  };
  if (loading) return <div className="flex justify-center py-16"><Loader /></div>;
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('notifications.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('notifications.description')}</p>
      </div>
      <div className="space-y-2">
        {items.map(item => <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.message}</p>
                <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <DriverStatusBadge status={item.is_read ? 'online' : 'pending'} />
                {!item.is_read ? <button type="button" onClick={() => onRead(item.id)} className="rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200">{t('notifications.buttons.markRead')}</button> : null}
              </div>
            </div>
          </Card>)}
      </div>
    </section>;
}
export default DriverNotificationsPage;