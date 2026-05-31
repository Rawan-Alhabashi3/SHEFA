import { useTranslation } from "react-i18next";
import { CheckCircle2, MapPin, RefreshCw, ShieldCheck, Store, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { approvePharmacyExchangeRequest, completeExchangeListing, getPharmacyExchangeRequests, markExchangeReceived, rejectPharmacyExchangeRequest } from '../../services/exchangeService';
import { formatPrice } from '../../utils/format';
import { FALLBACK_MEDICINE_IMAGE, resolveImageUrl } from '../../utils/image';
import { getStatusBadgeClasses, getStatusLabel } from '../../utils/statusBadge';
function requestListing(request) {
  return request.exchange_ad || request.exchangeAd || {};
}
function listingImages(listing) {
  const images = Array.isArray(listing.images) ? listing.images.map(image => image.path || image.url || image.image || image).filter(Boolean) : [];
  return [...new Set([...images, listing.image].filter(Boolean))];
}
function DetailItem({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>;
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
  const statusLabel = value => t(`exchange.statusLabels.${value}`, {
    defaultValue: getStatusLabel(value)
  });
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
        {[['Pending review', stats.pending, 'pendingReview'], ['Awaiting drop-off', stats.awaiting, 'awaitingDropoff'], ['Published', stats.published, 'published']].map(([label, value, key]) => <div key={label} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t(`exchange.stats.${key}`)}</p>
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
        const images = listingImages(listing);
        const mainImage = resolveImageUrl(images[0]) || FALLBACK_MEDICINE_IMAGE;
        return <article key={request.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
                <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                  <div>
                    <img src={mainImage} onError={event => {
                event.currentTarget.src = FALLBACK_MEDICINE_IMAGE;
              }} alt={listing.medicine_name || t('exchange.labels.productImage')} className="h-52 w-full rounded-2xl border border-slate-100 dark:border-slate-800 object-cover" />
                    {images.length > 1 ? <div className="mt-3 grid grid-cols-4 gap-2">
                        {images.slice(0, 4).map((image, index) => <img key={`${image}-${index}`} src={resolveImageUrl(image) || FALLBACK_MEDICINE_IMAGE} onError={event => {
                  event.currentTarget.src = FALLBACK_MEDICINE_IMAGE;
                }} alt={t('exchange.labels.productImage')} className="h-14 w-full rounded-xl border border-slate-100 dark:border-slate-800 object-cover" />)}
                      </div> : null}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={getStatusBadgeClasses(listing.listing_status)}>{statusLabel(listing.listing_status)}</span>
                      <span className={getStatusBadgeClasses(request.status)}>{statusLabel(request.status)}</span>
                      <span className={listing.ad_type === 'donation' ? getStatusBadgeClasses('paid') : getStatusBadgeClasses('pending')}>
                        {listing.ad_type === 'donation' ? t('exchange.labels.donation') : t('exchange.labels.resale')}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{listing.medicine_name}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><MapPin size={14} /> {listing.category || t('exchange.labels.notApplicable')} / {listing.governorate || t('exchange.labels.notApplicable')} / {listing.area || t('exchange.labels.notApplicable')}</p>
                      </div>
                      <div className="text-end">
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('exchange.labels.requestedPrice')}</p>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{listing.ad_type === 'donation' ? t('exchange.labels.free') : formatPrice(listing.price || 0)}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <DetailItem label={t('exchange.cards.customer')} value={customer.username || t('exchange.labels.customerDefault')} />
                      <DetailItem label={t('exchange.cards.customerPhone')} value={customer.phone || t('exchange.labels.noPhone')} />
                      <DetailItem label={t('exchange.cards.condition')} value={statusLabel(listing.condition)} />
                      <DetailItem label={t('exchange.cards.quantity')} value={listing.quantity || t('exchange.labels.notApplicable')} />
                      <DetailItem label={t('exchange.cards.expiration')} value={listing.expiration_date ? new Date(listing.expiration_date).toLocaleDateString() : t('exchange.labels.notApplicable')} />
                      <DetailItem label={t('exchange.cards.originalPackage')} value={listing.original_package_available ? t('exchange.labels.yes') : t('exchange.labels.no')} />
                      <DetailItem label={t('exchange.cards.createdDate')} value={listing.created_at ? new Date(listing.created_at).toLocaleDateString() : t('exchange.labels.notApplicable')} />
                      <DetailItem label={t('exchange.cards.securityCheck')} value={listing.security_check_status === null || listing.security_check_status === undefined ? t('exchange.labels.pending') : listing.security_check_status ? t('exchange.labels.passed') : t('exchange.labels.failed')} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('exchange.cards.description')}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{listing.description || t('exchange.labels.notApplicable')}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('exchange.cards.reasonAndPickupNotes')}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{listing.reason || t('exchange.labels.noReasonProvided')}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{listing.pickup_notes || t('exchange.labels.noPickupNotes')}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('exchange.cards.moderation')}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('exchange.cards.listingStatus')}: {statusLabel(listing.listing_status)}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t('exchange.cards.requestStatus')}: {statusLabel(request.status)}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{request.pharmacy_notes || listing.notes || listing.rejection_reason || t('exchange.labels.noPharmacyNotes')}</p>
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
                notes: notes[request.id] || t('exchange.messages.rejectedByPharmacyReview')
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