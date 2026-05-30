import { useTranslation } from "react-i18next";
import { CheckCircle2, PackageCheck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import OrdersStatusBadge from '../../components/pharmacy/OrdersStatusBadge';
import { acceptOrder, getMyOrders, markOrderReadyForPickup, rejectOrder } from '../../services/pharmacyService';
function PharmacyOrdersPage() {
  const {
    t
  } = useTranslation("pharmacy");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [actingId, setActingId] = useState(null);
  const load = () => {
    setLoading(true);
    setError('');
    return getMyOrders().then(res => setOrders(res?.data || [])).catch(err => setError(err?.response?.data?.message || t('orders.errors.failedToLoadOrders'))).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const onAccept = async orderId => {
    setActingId(orderId);
    try {
      await acceptOrder({
        order_id: orderId
      });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || t('orders.errors.failedToAcceptOrder'));
    } finally {
      setActingId(null);
    }
  };
  const onReject = async orderId => {
    setActingId(orderId);
    try {
      await rejectOrder({
        order_id: orderId
      });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || t('orders.errors.failedToRejectOrder'));
    } finally {
      setActingId(null);
    }
  };
  const onReady = async orderId => {
    setActingId(orderId);
    try {
      await markOrderReadyForPickup({
        order_id: orderId
      });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || t('orders.errors.failedToPublishDeliveryRequest'));
    } finally {
      setActingId(null);
    }
  };
  return <section>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('orders.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('orders.description')}</p>
        </div>
        <Button variant="secondary" onClick={load}>{t('orders.refresh')}</Button>
      </div>

      <Card className="p-5">
        {error ? <p className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-start text-slate-500 dark:text-slate-400">
                <th className="py-2">{t('orders.table.order')}</th>
                <th className="py-2">{t('orders.table.customer')}</th>
                <th className="py-2">{t('orders.table.payment')}</th>
                <th className="py-2">{t('orders.table.status')}</th>
                <th className="py-2">{t('orders.table.total')}</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td className="py-6 text-slate-500 dark:text-slate-400" colSpan={6}>{t('common.loading') || 'Loading...'}</td></tr> : null}
              {!loading && orders.length === 0 ? <tr><td className="py-6 text-slate-500 dark:text-slate-400" colSpan={6}>{t('orders.emptyStates.noActiveOrders')}</td></tr> : null}
              {!loading && orders.map(o => <tr key={o.id} className="border-t">
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-100">#{o.id}</td>
                  <td className="py-3">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{o.user?.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{o.user?.phone}</p>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    <p className="text-xs">{o.payment?.payment_method}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{o.payment?.payment_status}</p>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <OrdersStatusBadge status={o.order_status} />
                      <OrdersStatusBadge status={o.delivery_status || o.delivery_approval_status} />
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">${Number(o.total_price || 0).toFixed(2)}</td>
                  <td className="py-3">
                    {o.ph_approval_status === 'pending' ? <div className="flex justify-end gap-2">
                        <button className="rounded-xl border border-emerald-200 dark:border-emerald-700/70 px-3 py-2 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950/40" disabled={actingId === o.id} onClick={() => onAccept(o.id)}>
                          <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} /> {t('orders.buttons.accept')}</span>
                        </button>
                        <button className="rounded-xl border border-rose-200 dark:border-rose-700/70 px-3 py-2 text-rose-700 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:bg-rose-950/40" disabled={actingId === o.id} onClick={() => onReject(o.id)}>
                          <span className="inline-flex items-center gap-2"><XCircle size={15} /> {t('orders.buttons.reject')}</span>
                        </button>
                      </div> : o.ph_approval_status === 'approved' && o.order_status === 'preparing' ? <div className="flex justify-end">
                        <button className="rounded-xl border border-blue-200 dark:border-blue-700/70 px-3 py-2 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40" disabled={actingId === o.id} onClick={() => onReady(o.id)}>
                          <span className="inline-flex items-center gap-2"><PackageCheck size={15} />{t('orders.buttons.readyForPickup')}</span>
                        </button>
                      </div> : o.order_status === 'ready_for_pickup' ? <p className="text-end text-xs font-semibold text-blue-600 dark:text-blue-300">{t('orders.messages.publishedToDeliveryQueue')}</p> : <p className="text-end text-xs text-slate-500 dark:text-slate-400">{t('orders.messages.approved')}</p>}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </section>;
}
export default PharmacyOrdersPage;