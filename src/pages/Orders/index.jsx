import { useTranslation } from "react-i18next";
import { Clock3, CreditCard, PackageCheck, RefreshCw, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import { getMyOrderHistory } from '../../services/orderService';
import { formatPrice } from '../../utils/format';
import { getStatusBadgeClasses, getStatusLabel } from '../../utils/statusBadge';
const steps = [{
  key: 'pending',
  label: 'Placed'
}, {
  key: 'partially_accepted',
  label: 'Reviewing'
}, {
  key: 'preparing',
  label: 'Preparing'
}, {
  key: 'ready_for_pickup',
  label: 'Ready'
}, {
  key: 'driver_assigned',
  label: 'Driver'
}, {
  key: 'picked_up',
  label: 'Picked up'
}, {
  key: 'on_the_way',
  label: 'On the way'
}, {
  key: 'delivered',
  label: 'Delivered'
}];
function orderProgress(status) {
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
  const {
    t
  } = useTranslation("orders");
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
      setError(err?.response?.data?.message || 'Unable to load your orders right now.');
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
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">{t("Orders tracking")}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">My Orders</h1>
        </div>
        <button type="button" onClick={loadOrders} className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {location.state?.checkoutComplete ? <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 dark:bg-emerald-950/40 px-5 py-4 text-sm text-emerald-800">{t("Checkout completed.")}{location.state.ordersCount || 'Your'}{t("pharmacy orders were grouped into")}{location.state.shipmentsCount || 'delivery'}{t("shipment groups.")}</div> : null}

      {error ? <div className="mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-5 py-4 text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}

      {loading ? <div className="grid gap-4">
          {[1, 2, 3].map(item => <div key={item} className="h-40 animate-pulse rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20" />)}
        </div> : orders.length === 0 ? <EmptyState title={t("No orders yet")} description="Complete checkout from your cart and your pharmacy orders will appear here." /> : <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            {orders.map(order => {
          const displayStatus = order.customer_status || order.order_status;
          const progress = orderProgress(displayStatus);
          return <article key={order.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t("Order #")}{order.id}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.pharmacy?.pharmacy_name || 'Pharmacy order'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={getStatusBadgeClasses(displayStatus)}>{getStatusLabel(displayStatus)}</span>
                      <span className={getStatusBadgeClasses(order.payment?.payment_status)}>{getStatusLabel(order.payment?.payment_status)}</span>
                    </div>
                  </div>

                  {order.approval_summary?.total > 1 ? <div className="mt-3 rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 text-sm text-blue-800 dark:text-blue-100">
                      {order.approval_summary.approved}{t("of")}{order.approval_summary.total}{t("pharmacies approved this grouped order.")}</div> : null}

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Payment")}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                        <CreditCard size={16} className="text-blue-600 dark:text-blue-300" />
                        {getStatusLabel(order.payment?.payment_method)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Delivery group</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                        <Truck size={16} className="text-blue-600 dark:text-blue-300" />
                        {order.missions?.[0]?.area || order.area || 'Pending'}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total</p>
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
                        <span className="text-slate-700 dark:text-slate-200">{item.medicine?.name || t("Medicine")}{t("x")}{item.desired_quantity}</span>
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
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Delivery groups</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{missionGroups.length}{t("active grouping records")}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {missionGroups.length === 0 ? <p className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-500 dark:text-slate-400">Delivery grouping will appear after checkout creates a mission.</p> : missionGroups.map(mission => <div key={mission.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t("Mission #")}{mission.id}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{mission.governorate} / {mission.area || 'Unspecified area'}</p>
                        </div>
                        <span className={getStatusBadgeClasses(mission.customer_status || mission.status)}>{getStatusLabel(mission.customer_status || mission.status)}</span>
                      </div>
                      {mission.approval_summary ? <p className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-200">
                          {mission.approval_summary.approved}/{mission.approval_summary.total}{t("pharmacies approved")}</p> : null}
                      <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-600 dark:text-slate-300">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Grouped pharmacies</p>
                        <p className="mt-1">{mission.orders.map(item => item.pharmacy?.pharmacy_name).filter(Boolean).join(', ') || 'Pending pharmacy details'}</p>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Clock3 size={14} className="text-blue-600 dark:text-blue-300" />
                        {mission.delivery?.user?.username ? `Driver: ${mission.delivery.user.username}` : 'Driver will be assigned soon'}
                      </div>
                    </div>)}
              </div>
            </section>

            <Link to="/marketplace" className="inline-flex w-full justify-center rounded-full border border-blue-200 dark:border-blue-700/70 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-200 transition hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40">
              Continue Shopping
            </Link>
          </aside>
        </div>}
    </Container>;
}
export default OrdersPage;