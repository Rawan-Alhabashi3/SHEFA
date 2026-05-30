import { useTranslation } from "react-i18next";
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { deleteMyNotification, getMyNotifications, markAllMyNotificationsRead, markMyNotificationRead } from '../../services/notificationsService';
function NotificationsPage() {
  const {
    t
  } = useTranslation("notifications");
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const [page, setPage] = useState(1);
  const load = async (nextStatus = status, nextPage = page) => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyNotifications({
        status: nextStatus,
        page: nextPage,
        per_page: 12
      });
      const payload = res?.data || res || {};
      const paginator = payload?.items || payload?.notifications || {};
      const nextItems = Array.isArray(paginator?.data) ? paginator.data : Array.isArray(paginator) ? paginator : Array.isArray(payload?.data) ? payload.data : [];
      setItems(nextItems);
      setUnreadCount(Number(payload?.unread_count || 0));
      setMeta({
        current_page: Number(paginator?.current_page || 1),
        last_page: Number(paginator?.last_page || 1),
        total: Number(paginator?.total || 0)
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load notifications right now.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(status, page);
  }, [status, page]);
  const onMarkRead = async id => {
    setActionLoading(true);
    setItems(prev => prev.map(n => n.id === id ? {
      ...n,
      is_read: true
    } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await markMyNotificationRead(id);
    } finally {
      setActionLoading(false);
    }
  };
  const onMarkAllRead = async () => {
    setActionLoading(true);
    setItems(prev => prev.map(n => ({
      ...n,
      is_read: true
    })));
    setUnreadCount(0);
    try {
      await markAllMyNotificationsRead();
    } finally {
      setActionLoading(false);
    }
  };
  const onDelete = async id => {
    setActionLoading(true);
    const target = items.find(x => x.id === id);
    setItems(prev => prev.filter(n => n.id !== id));
    if (target && !target.is_read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    try {
      await deleteMyNotification(id);
    } finally {
      setActionLoading(false);
    }
  };
  const tabs = useMemo(() => [{
    key: 'all',
    label: 'All'
  }, {
    key: 'unread',
    label: 'Unread'
  }, {
    key: 'read',
    label: 'Read'
  }], []);
  return <Container className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("Order updates, delivery events, pharmacy announcements, and coupon rewards.")}</p>
        </div>
        <button type="button" onClick={onMarkAllRead} disabled={unreadCount <= 0 || actionLoading} className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-700/70 bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-200 transition hover:bg-blue-100 dark:hover:bg-blue-950 dark:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60">
          <CheckCheck size={15} />{t("Mark all as read")}</button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tabs.map(tab => <button key={tab.key} type="button" onClick={() => {
        setStatus(tab.key);
        setPage(1);
      }} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${status === tab.key ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {tab.label}
          </button>)}
      </div>

      {loading ? <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-sm text-slate-600 dark:text-slate-300">Loading notifications...</div> : error ? <div className="rounded-2xl border border-rose-100 bg-rose-50 dark:bg-rose-950/40 p-6 text-sm font-medium text-rose-700 dark:text-rose-200">{error}</div> : items.length === 0 ? <EmptyState title={t("No notifications yet")} description="You will see updates here once activity starts on your orders and coupons." /> : <div className="space-y-3">
          {items.map(item => <article key={item.id} className={`rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-slate-950/20 transition ${item.is_read ? 'border-slate-200 dark:border-slate-700' : 'border-blue-200 dark:border-blue-700/70 ring-1 ring-blue-100 dark:ring-blue-950'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-semibold">{item.type || 'notification'}</span>
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  {item.action_url ? <Link to={item.action_url} className="mt-2 inline-flex text-xs font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200">{t("View details")}</Link> : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!item.is_read ? <button type="button" onClick={() => onMarkRead(item.id)} className="rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-950 dark:bg-blue-950" disabled={actionLoading}>{t("Mark read")}</button> : null}
                  <button type="button" onClick={() => onDelete(item.id)} className="rounded-lg bg-rose-50 dark:bg-rose-950/40 p-2 text-rose-700 dark:text-rose-200 hover:bg-rose-100" disabled={actionLoading} aria-label="Delete notification">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>)}
        </div>}

      {meta.last_page > 1 ? <Pagination currentPage={meta.current_page} totalPages={meta.last_page} onChange={setPage} /> : null}

      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <Bell size={14} />{t("Unread:")}{unreadCount}
      </div>
    </Container>;
}
export default NotificationsPage;