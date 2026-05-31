import { useTranslation } from "react-i18next";
import { Clock3, CreditCard, PackageCheck, RefreshCw, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import { getMyOrderHistory } from '../../services/orderService';
import { formatPrice } from '../../utils/format';
import { getStatusBadgeClasses } from '../../utils/statusBadge';
import { translateEnum } from '../../utils/translateEnum';

const STEP_KEYS = [
  { key: 'pending', labelKey: 'placed' },
  { key: 'partially_accepted', labelKey: 'reviewing' },
  { key: 'preparing', labelKey: 'preparing' },
  { key: 'ready_for_pickup', labelKey: 'ready' },
  { key: 'driver_assigned', labelKey: 'driver' },
  { key: 'picked_up', labelKey: 'picked_up' },
  { key: 'on_the_way', labelKey: 'on_the_way' },
  { key: 'delivered', labelKey: 'delivered' },
];
function orderProgress(status, steps) {
  if (status === 'cancelled' || status === 'partially_rejected') return 0;
  const normalized = status === 'in_process' ? 'preparing' : status === 'delivering' ? 'on_the_way' : status === 'picking_up' ? 'picked_up' : status;
  const index = steps.findIndex(step => step.key === normalized);
  return index < 0 ? 0 : index;
}
function flattenOrders(payload) {
  if (Array.isArray(payload)) return payload;
  return [...(payload?.active_orders || []), ...(payload?.past_orders || [])];
}
function OrdersPage() {
  const { t } = useTranslation(['orders', 'common']);
  const steps = useMemo(
    () => STEP_KEYS.map(step => ({
      ...step,
      label: t(`steps.${step.labelKey}`, { ns: 'orders' }),
    })),
    [t],
  );
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMyOrderHistory();
      setOrders(flattenOrders(response?.data || response));
    } catch (err) {
      setError(err?.response?.data?.message || t('loadError', { ns: 'orders' }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadOrders();
    const intervalId = window.setInterval(loadOrders, 30000);
    const handleFocus = () => loadOrders();
    window.addEventListener('focus', handleFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  const missionGroups = useMemo(() => {
    const groups = new Map();
    for (const order of orders) {
      for (const mission of order.missions || []) {
        if (!groups.has(mission.id)) {
          groups.set(mission.id, {
            ...mission,
            orders: new Map()
          });
        }
        const group = groups.get(mission.id);
        for (const groupedOrder of mission.orders || [order]) {
          group.orders.set(groupedOrder.id || order.id, groupedOrder);
        }
      }
    }
    return Array.from(groups.values()).map(group => ({
      ...group,
      orders: Array.from(group.orders.values())
    }));
  }, [orders]);
  return <Container className="py-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">{t('trackingEyebrow')}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{t('title')}</h1>
        </div>
        <button type="button" onClick={loadOrders} className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">
          <RefreshCw size={16} />
          {t('refresh', { ns: 'common' })}
        </button>
      </div>

      {location.state?.checkoutComplete ? <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 dark:bg-emerald-950/40 px-5 py-4 text-sm text-emerald-800">{t('checkoutComplete')}{location.state.ordersCount || ''} {t('groupedInto')}{location.state.shipmentsCount || ''} {t('shipmentGroups')}</div> : null}

      {error ? <div className="mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-5 py-4 text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}

      {loading ? <div className="grid gap-4">
          {[1, 2, 3].map(item => <div key={item} className="h-40 animate-pulse rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20" />)}
        </div> : orders.length === 0 ? <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} /> : <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            {orders.map(order => {
          const displayStatus = order.customer_status || order.order_status;
          const progress = orderProgress(displayStatus, steps);
          return <article key={order.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('orderNumber')}{order.id}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.pharmacy?.pharmacy_name || t('pharmacyOrder')}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={getStatusBadgeClasses(displayStatus)}>{translateEnum(t, displayStatus, { ns: 'common', labelKey: 'statusLabels' })}</span>
                      <span className={getStatusBadgeClasses(order.payment?.payment_status)}>{translateEnum(t, order.payment?.payment_status, { ns: 'common', labelKey: 'paymentStatuses' })}</span>
                    </div>
                  </div>

                  {order.approval_summary?.total > 1 ? <div className="mt-3 rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 text-sm text-blue-800 dark:text-blue-100">
                      {order.approval_summary.approved}{t('of')}{order.approval_summary.total} {t('pharmaciesApprovedGrouped')}</div> : null}

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('payment')}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                        <CreditCard size={16} className="text-blue-600 dark:text-blue-300" />
                        {translateEnum(t, order.payment?.payment_method, { ns: 'common', labelKey: 'paymentMethods' })}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('deliveryGroup')}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                        <Truck size={16} className="text-blue-600 dark:text-blue-300" />
                        {order.missions?.[0]?.area || order.area || t('pendingArea')}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('total')}</p>
                      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{formatPrice(order.total_price)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="grid grid-cols-4 gap-2">
                      {steps.map((step, index) => {
                  const active = displayStatus === 'delivered' || index <= progress;
                  return <div key={step.key} className="min-w-0">
                            <div className={`h-2 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            <p className="mt-1 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{step.label}</p>
                          </div>;
                })}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {(order.order_items || order.orderItems || []).map(item => <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2 text-sm">
                        <span className="text-slate-700 dark:text-slate-200">{item.medicine?.name || t('medicine')}{t('quantityTimes')}{item.desired_quantity}</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPrice(item.total_price)}</span>
                      </div>)}
                  </div>
                </article>;
        })}
          </div>

          <aside className="h-fit space-y-4 xl:sticky xl:top-24">
            <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-300">
                  <PackageCheck size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('deliveryGroups')}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{missionGroups.length} {t('activeGroupingRecords')}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {missionGroups.length === 0 ? <p className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-500 dark:text-slate-400">{t('groupingHint')}</p> : missionGroups.map(mission => <div key={mission.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('missionNumber')}{mission.id}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{mission.governorate} / {mission.area || t('unspecifiedArea')}</p>
                        </div>
                        <span className={getStatusBadgeClasses(mission.customer_status || mission.status)}>{translateEnum(t, mission.customer_status || mission.status, { ns: 'common', labelKey: 'statusLabels' })}</span>
                      </div>
                      {mission.approval_summary ? <p className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-200">
                          {mission.approval_summary.approved}/{mission.approval_summary.total} {t('pharmaciesApproved')}</p> : null}
                      <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-600 dark:text-slate-300">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{t('groupedPharmacies')}</p>
                        <p className="mt-1">{mission.orders.map(item => item.pharmacy?.pharmacy_name).filter(Boolean).join(', ') || t('pendingPharmacyDetails')}</p>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Clock3 size={14} className="text-blue-600 dark:text-blue-300" />
                        {mission.delivery?.user?.username ? t('driverAssigned', { name: mission.delivery.user.username }) : t('driverPending')}
                      </div>
                    </div>)}
              </div>
            </section>

            <Link to="/marketplace" className="inline-flex w-full justify-center rounded-full border border-blue-200 dark:border-blue-700/70 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-200 transition hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40">
              {t('continueShopping')}
            </Link>
          </aside>
        </div>}
    </Container>;
}
export default OrdersPage;