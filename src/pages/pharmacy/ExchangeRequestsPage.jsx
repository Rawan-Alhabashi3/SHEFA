import { useTranslation } from "react-i18next";
import { CheckCircle2, Phone, RefreshCw, ShieldCheck, Store, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { approvePharmacyExchangeRequest, completeExchangeListing, getPharmacyExchangeRequests, markExchangeReceived, rejectPharmacyExchangeRequest } from '../../services/exchangeService';
import { formatPrice } from '../../utils/format';
import { getStatusBadgeClasses, getStatusLabel } from '../../utils/statusBadge';
function requestListing(request) {
  return request.exchange_ad || request.exchangeAd || {};
}
function PharmacyExchangeRequestsPage() {
  const {
    t
  } = useTranslation("pharmacy");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);
  const [notes, setNotes] = useState({});
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getPharmacyExchangeRequests();
      setRequests(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || t('exchange.errors.failedToLoadRequests'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const stats = useMemo(() => ({
    pending: requests.filter(item => item.status === 'pending').length,
    awaiting: requests.filter(item => requestListing(item).listing_status === 'awaiting_dropoff').length,
    published: requests.filter(item => requestListing(item).listing_status === 'published').length
  }), [requests]);
  const act = async (id, handler, successMessage) => {
    setActingId(id);
    try {
      await handler();
      toast.success(successMessage);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || t('exchange.errors.actionFailed'));
    } finally {
      setActingId(null);
    }
  };
  return <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('exchange.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('exchange.description')}</p>
        </div>
        <Button variant="secondary" onClick={load}>
          <span className="inline-flex items-center gap-2"><RefreshCw size={16} /> {t('exchange.refresh')}</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[['Pending review', stats.pending], ['Awaiting drop-off', stats.awaiting], ['Published', stats.published]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label === 'Pending review' ? t('exchange.stats.pendingReview') : label === 'Awaiting drop-off' ? t('exchange.stats.awaitingDropoff') : t('exchange.stats.published')}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
          </div>)}
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}

      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20" /> : requests.length === 0 ? <EmptyState title={t('exchange.emptyStates.noCommunityRequests')} description={t('exchange.emptyStates.noRequestsDescription')} /> : <div className="grid gap-4">
          {requests.map(request => {
        const listing = requestListing(request);
        const customer = listing.user || {};
        const canApprove = request.status === 'pending' && listing.listing_status === 'pending';
        const canReceive = listing.listing_status === 'awaiting_dropoff';
        const canComplete = listing.listing_status === 'published';
        return <article key={request.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={getStatusBadgeClasses(listing.listing_status)}>{getStatusLabel(listing.listing_status)}</span>
                      <span className={listing.ad_type === 'donation' ? getStatusBadgeClasses('paid') : getStatusBadgeClasses('pending')}>
                        {listing.ad_type === 'donation' ? 'Donation' : t('exchange.labels.resale')}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{listing.medicine_name}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{listing.category} / {listing.governorate} / {listing.area}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('exchange.labels.requestedPrice')}</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{listing.ad_type === 'donation' ? t('exchange.labels.free') : formatPrice(listing.price || 0)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('exchange.cards.customer')}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{customer.username || t('exchange.labels.customerDefault')}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Phone size={13} /> {customer.phone || t('exchange.labels.noPhone')}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('exchange.cards.condition')}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{getStatusLabel(listing.condition)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('exchange.cards.quantity')}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{listing.quantity}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('exchange.cards.expiration')}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{listing.expiration_date ? new Date(listing.expiration_date).toLocaleDateString() : t('exchange.labels.notApplicable')}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('exchange.cards.description')}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{listing.description || listing.notes}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('exchange.cards.reasonAndPickupNotes')}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{listing.reason || t('exchange.labels.noReasonProvided')}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{listing.pickup_notes || t('exchange.labels.noPickupNotes')}</p>
                  </div>
                </div>

                {canApprove ? <div className="mt-4 rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 p-3">
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('exchange.actions.pharmacistNotes')}</label>
                    <textarea className="min-h-20 w-full resize-none rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" value={notes[request.id] || ''} onChange={e => setNotes(p => ({
              ...p,
              [request.id]: e.target.value
            }))} />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" disabled={actingId === request.id} onClick={() => act(request.id, () => approvePharmacyExchangeRequest({
                request_id: request.id,
                notes: notes[request.id]
              }), t('exchange.messages.listingApproved'))}>
                        <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> {t('exchange.actions.approve')}</span>
                      </Button>
                      <button type="button" disabled={actingId === request.id} onClick={() => act(request.id, () => rejectPharmacyExchangeRequest({
                request_id: request.id,
                notes: notes[request.id] || 'Rejected by pharmacy review.'
              }), t('exchange.messages.requestRejected'))} className="inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-700/70 px-5 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-200 transition hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:bg-rose-950/40 disabled:opacity-60">
                        <XCircle size={16} /> {t('exchange.actions.reject')}
                      </button>
                    </div>
                  </div> : null}

                {canReceive || canComplete ? <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 dark:bg-emerald-950/40 p-3">
                    <div className="flex items-center gap-2 text-sm text-emerald-800">
                      <ShieldCheck size={17} />
                      {canReceive ? t('exchange.messages.customerShouldDeliver') : t('exchange.messages.listingPublic')}
                    </div>
                    {canReceive ? <Button type="button" disabled={actingId === request.id} onClick={() => act(request.id, () => markExchangeReceived(listing.id), t('exchange.messages.listingReceived'))}>
                        <span className="inline-flex items-center gap-2"><Store size={16} />{t('exchange.actions.markAsReceived')}</span>
                      </Button> : <Button type="button" disabled={actingId === request.id} onClick={() => act(request.id, () => completeExchangeListing(listing.id), t('exchange.messages.listingCompleted'))}>
                        {t('exchange.actions.complete')}
                      </Button>}
                  </div> : null}
              </article>;
      })}
        </div>}
    </div>;
}
export default PharmacyExchangeRequestsPage;