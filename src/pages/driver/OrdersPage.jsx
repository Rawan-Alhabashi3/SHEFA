import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import DriverStatusBadge from '../../components/driver/DriverStatusBadge';
import { formatPrice } from '../../utils/format';
import { acceptMission, completeMission, getAvailableMissions, getDriverMissions, rejectMission, startMissionDelivering, startMissionPickingUp } from '../../services/driverService';
const summarizeMedicines = order => (order.order_items || order.orderItems || []).map(item => {
  const name = item.medicine?.name || `Medicine #${item.medicine_id}`;
  const qty = item.desired_quantity || 1;
  return `${name} x${qty}`;
}).join(', ');
const paymentAmountDue = mission => {
  const orders = mission.orders || [];
  const cashTotal = orders.filter(order => (order.payment?.payment_method || mission.payment_type) === 'cash' && (order.payment?.payment_status || mission.payment_status) !== 'paid').reduce((sum, order) => sum + Number(order.payment?.amount ?? order.total_price ?? 0), 0);
  return cashTotal;
};
function DriverOrdersPage() {
  const {
    t
  } = useTranslation("driver");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('available');
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState('');
  const load = async (nextTab = tab) => {
    setLoading(true);
    setError('');
    try {
      const response = nextTab === 'available' ? await getAvailableMissions() : await getDriverMissions(nextTab === 'completed' ? 'completed' : 'active');
      setMissions(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || t('orders.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(tab);
  }, [tab]);
  const runAction = async (action, missionId) => {
    setError('');
    try {
      await action(missionId);
      await load(tab);
    } catch (err) {
      setError(err?.response?.data?.message || t('orders.errors.unableToUpdate'));
    }
  };
  return <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('orders.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('orders.description')}</p>
        </div>
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
          {[['available', t('orders.tabs.available')], ['assigned', t('orders.tabs.assigned')], ['completed', t('orders.tabs.completed')]].map(([key, label]) => <button key={key} type="button" onClick={() => setTab(key)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${tab === key ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {label}
            </button>)}
        </div>
      </div>

      {error ? <p className="rounded-xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

      {loading ? <div className="flex justify-center py-16"><Loader /></div> : <div className="grid gap-4 xl:grid-cols-2">
          {missions.length === 0 ? <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">{t('orders.emptyStates.noMissions')}{tab}{t('orders.emptyStates.missionsRightNow')}</Card> : null}

          {missions.map(mission => <Card key={mission.id} className="p-4 ring-1 ring-slate-200 dark:ring-slate-700/70">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('orders.mission.missionNumber')}{mission.id}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{mission.customer_name} - {mission.address}</p>
                </div>
                <DriverStatusBadge status={mission.status} />
              </div>

              <div className="grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.pharmacies')}</span> {mission.pharmacy_count ?? (mission.orders || []).length}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.medicines')}</span> {mission.medicines_count ?? '-'}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.total')}</span> {formatPrice(mission.total_amount || 0)}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.area')}</span> {mission.area || '-'}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.governorate')}</span> {mission.governorate}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.phone')}</span> {mission.phone_number}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.payment')}</span> {mission.payment_type || '-'}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.paymentStatus')}</span> {mission.payment_status || '-'}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.codDue')}</span> {formatPrice(paymentAmountDue(mission))}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.approved')}</span> {mission.approval_summary?.approved ?? 0}/{mission.approval_summary?.total ?? (mission.orders || []).length}</p>
                <p className="sm:col-span-2"><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.address')}</span> {mission.address}</p>
              </div>

              {!mission.ready_for_driver && mission.status === 'pending' ? <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-xs font-medium text-amber-800">{t('orders.mission.waitingForApproval')}</div> : null}

              <div className="mt-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-700 dark:text-slate-200">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{t('orders.mission.pickupPharmacies')}</p>
                <div className="mt-2 space-y-2">
                  {(mission.orders || []).slice().sort((a, b) => (a.pivot?.pickup_sequence || 0) - (b.pivot?.pickup_sequence || 0)).map(order => <div key={order.id} className="rounded-lg bg-white dark:bg-slate-900 p-2 ring-1 ring-slate-200 dark:ring-slate-700/70">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          #{order.pivot?.pickup_sequence || 1} {order.pharmacy?.pharmacy_name || `${t('orders.mission.pharmacyNumber')}${order.pharmacy_id}`}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">{order.pharmacy?.address || ''}{order.pharmacy?.area ? ` (${order.pharmacy.area})` : ''}</p>
                        <p className="mt-1"><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.medicines')}</span> {summarizeMedicines(order) || t('orders.mission.noMedicineSummary')}</p>
                        {order.notes ? <p className="mt-1"><span className="font-semibold text-slate-800 dark:text-slate-100">{t('orders.mission.notes')}</span> {order.notes}</p> : null}
                      </div>)}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                {[['Assigned', ['accepted', 'picking_up', 'delivering', 'delivered'].includes(mission.status)], ['Picked up', ['picking_up', 'delivering', 'delivered'].includes(mission.status)], ['On way', ['delivering', 'delivered'].includes(mission.status)], ['Delivered', mission.status === 'delivered']].map(([label, done]) => <div key={label} className={`rounded-lg px-2 py-2 text-center font-semibold ${done ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    {label}
                  </div>)}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {mission.status === 'pending' ? <Button disabled={!mission.ready_for_driver} className="!rounded-lg px-3 py-2 text-xs disabled:opacity-50" onClick={() => runAction(acceptMission, mission.id)}>
                    {tab === 'available' ? t('orders.buttons.claimAccept') : t('orders.buttons.acceptMission')}
                  </Button> : null}
                {mission.status === 'accepted' ? <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(startMissionPickingUp, mission.id)}>{t('orders.buttons.startPickup')}</Button> : null}
                {mission.status === 'picking_up' ? <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(startMissionDelivering, mission.id)}>{t('orders.buttons.startDelivery')}</Button> : null}
                {mission.status === 'delivering' ? <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(completeMission, mission.id)}>{t('orders.buttons.markDelivered')}</Button> : null}
                {['pending', 'accepted'].includes(mission.status) && tab !== 'available' ? <Button variant="secondary" className="!rounded-lg px-3 py-2 text-xs" onClick={() => runAction(rejectMission, mission.id)}>{t('orders.buttons.releaseTask')}</Button> : null}
              </div>
            </Card>)}
        </div>}
    </section>;
}
export default DriverOrdersPage;