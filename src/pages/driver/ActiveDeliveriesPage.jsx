import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import DriverStatusBadge from '../../components/driver/DriverStatusBadge';
import Button from '../../components/common/Button';
import { acceptMission, completeMission, getDriverMissions, startMissionDelivering, startMissionPickingUp } from '../../services/driverService';
import { formatPrice } from '../../utils/format';
const summarizeMedicines = order => (order.order_items || order.orderItems || []).map(item => `${item.medicine?.name || `Medicine #${item.medicine_id}`} x${item.desired_quantity || 1}`).join(', ');
function ActiveDeliveriesPage() {
  const {
    t
  } = useTranslation("driver");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    getDriverMissions('active').then(res => setRecords(res?.data || [])).catch(err => setError(err?.response?.data?.message || t('deliveries.errors.failedToLoad'))).finally(() => setLoading(false));
  }, []);
  const reload = async () => {
    const res = await getDriverMissions('active');
    setRecords(res?.data || []);
  };
  const runAction = async (action, missionId) => {
    setLoading(true);
    setError('');
    try {
      await action(missionId);
      await reload();
    } catch (err) {
      setError(err?.response?.data?.message || t('deliveries.errors.unableToUpdate'));
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="flex justify-center py-16"><Loader /></div>;
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('deliveries.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('deliveries.description')}</p>
      </div>
      {error ? <p className="rounded-xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {records.length === 0 ? <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">{t('deliveries.emptyStates.noActiveMissions')}</Card> : null}

        {records.map(item => <Card key={item.id} className="p-4 ring-1 ring-slate-200 dark:ring-slate-700/60">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('orders.mission.missionNumber')}{item.id}</h3>
              <DriverStatusBadge status={item.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.customer_name} - {item.address}</p>
            <div className="mt-3 grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-3">
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.governorate')}</span> {item.governorate}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.area')}</span> {item.area || '-'}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.phone')}</span> {item.phone_number}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.pharmacies')}</span> {item.pharmacy_count ?? (item.orders || []).length}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.medicines')}</span> {item.medicines_count ?? '-'}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.total')}</span> {formatPrice(item.total_amount || 0)}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.payment')}</span> {item.payment_type || '-'}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.paymentStatus')}</span> {item.payment_status || '-'}</p>
            </div>

            <div className="mt-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-700 dark:text-slate-200">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{t('orders.mission.pickupPoints')}</p>
              <div className="mt-2 space-y-2">
                {(item.orders || []).slice().sort((a, b) => (a.pivot?.pickup_sequence || 0) - (b.pivot?.pickup_sequence || 0)).map(o => <div key={o.id} className="rounded-lg bg-white dark:bg-slate-900 p-2 ring-1 ring-slate-200 dark:ring-slate-700/70">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">#{o.pivot?.pickup_sequence || 1}: {o.pharmacy?.pharmacy_name || `${t('orders.mission.pharmacyNumber')}${o.pharmacy_id}`}</p>
                      <p className="text-slate-500 dark:text-slate-400">{o.pharmacy?.address || ''}{o.pharmacy?.area ? ` (${o.pharmacy.area})` : ''}</p>
                      <p className="mt-1"><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.medicines')}</span> {summarizeMedicines(o) || t('orders.mission.noMedicineSummary')}</p>
                      {o.notes ? <p className="mt-1"><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.notes')}</span> {o.notes}</p> : null}
                    </div>)}
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.destination')}</span> {item.address}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
              {[['Assigned', ['accepted', 'picking_up', 'delivering', 'delivered'].includes(item.status)], ['Picked up', ['picking_up', 'delivering', 'delivered'].includes(item.status)], ['On way', ['delivering', 'delivered'].includes(item.status)], ['Delivered', item.status === 'delivered']].map(([label, done]) => <div key={label} className={`rounded-lg px-2 py-2 text-center font-semibold ${done ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {label}
                </div>)}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {item.status === 'pending' ? <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(acceptMission, item.id)}>{t('orders.buttons.acceptMission')}</Button> : null}

              {item.status === 'accepted' ? <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(startMissionPickingUp, item.id)}>{t('orders.buttons.startPickingUp')}</Button> : null}

              {item.status === 'picking_up' ? <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(startMissionDelivering, item.id)}>{t('orders.buttons.startDelivering')}</Button> : null}

              {item.status === 'delivering' ? <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(completeMission, item.id)}>{t('orders.buttons.markDelivered')}</Button> : null}
            </div>
          </Card>)}
      </div>
    </section>;
}
export default ActiveDeliveriesPage;