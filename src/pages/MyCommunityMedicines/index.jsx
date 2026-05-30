import { useTranslation } from "react-i18next";
import { PackageCheck, Store, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import { deletePendingExchangeListing, getMyExchangeListings } from '../../services/exchangeService';
import { formatPrice } from '../../utils/format';
import { getStatusBadgeClasses, getStatusLabel } from '../../utils/statusBadge';
function MyCommunityMedicinesPage() {
  const {
    t
  } = useTranslation("community");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMyExchangeListings();
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.unableToLoadListings'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const stats = useMemo(() => ({
    pending: items.filter(item => item.listing_status === 'pending').length,
    active: items.filter(item => ['awaiting_dropoff', 'published'].includes(item.listing_status)).length,
    completed: items.filter(item => item.listing_status === 'completed').length
  }), [items]);
  const remove = async id => {
    setActingId(id);
    try {
      await deletePendingExchangeListing(id);
      toast.success(t('errors.pendingDeleted'));
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || t('errors.unableToDelete'));
    } finally {
      setActingId(null);
    }
  };
  return <Container className="py-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">{t('myListings.title')}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{t('myListings.subtitle')}</h1>
        </div>
        <Link to="/community-medicines">
          <Button>{t('myListings.submitListing')}</Button>
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[[t('myListings.pendingReview'), stats.pending], [t('myListings.activeWorkflow'), stats.active], [t('myListings.completed'), stats.completed]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
          </div>)}
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(item => (
            <div key={item} className="h-40 animate-pulse rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title={t('emptyStates.noListingsYet')} description={t('emptyStates.noListingsDescription')} />
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <article key={item.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={getStatusBadgeClasses(item.listing_status)}>{getStatusLabel(item.listing_status)}</span>
                    <span className={item.ad_type === 'donation' ? getStatusBadgeClasses('paid') : getStatusBadgeClasses('pending')}>
                      {item.ad_type === 'donation' ? t('myListings.donation') : t('myListings.resale')}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{item.medicine_name}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.category} / {item.governorate} / {item.area}</p>
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{item.ad_type === 'donation' ? t('myListings.free') : formatPrice(item.price || 0)}</p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('myListings.assignedPharmacy')}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <Store size={16} className="text-blue-600 dark:text-blue-300" />
                    {item.assigned_pharmacy?.pharmacy_name || item.assignedPharmacy?.pharmacy_name || t('myListings.awaitingApproval')}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('myListings.quantity')}</p>
                  <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{item.quantity}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('myListings.expiration')}</p>
                  <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <PackageCheck size={16} className="text-blue-600 dark:text-blue-300" />{t('myListings.workflowTimeline')}</div>
                <div className="mt-3 grid gap-2 md:grid-cols-4">
                  {(item.status_history || item.statusHistory || []).slice(0, 4).map(history => <div key={history.id} className="rounded-xl bg-slate-50 dark:bg-slate-950 p-2">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{getStatusLabel(history.status)}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">{history.notes}</p>
                    </div>)}
                </div>
              </div>

              {item.listing_status === 'pending' ? <button type="button" onClick={() => remove(item.id)} disabled={actingId === item.id} className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-700/70 px-4 py-2 text-sm font-semibold text-rose-700 dark:text-rose-200 transition hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:bg-rose-950/40 disabled:opacity-60">
                  <Trash2 size={16} />
                  {t('myListings.deletePendingListing')}
                </button> : null}
            </article>))}
        </div>
      )}
    </Container>;
}
export default MyCommunityMedicinesPage;