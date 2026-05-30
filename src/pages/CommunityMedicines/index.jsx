import { useTranslation } from "react-i18next";
import { BadgeCheck, Camera, Gift, HandHeart, MapPin, MessageCircle, PackageCheck, Phone, RefreshCw, Search, ShieldCheck, Tag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { GOVERNORATE_AREAS, GOVERNORATES } from '../../constants/locations';
import { useAuth } from '../../context/AuthContext';
import { contactExchangePharmacy, createExchangeListing, getCommunityMedicines } from '../../services/exchangeService';
import { listMarketplacePharmacies } from '../../services/pharmacyService';
import { formatPrice } from '../../utils/format';
import { FALLBACK_MEDICINE_IMAGE, resolveImageUrl, withFallback } from '../../utils/image';
import { getStatusBadgeClasses, getStatusLabel } from '../../utils/statusBadge';
const categories = ['Medicine', 'Vitamins', 'Medical Supplies', 'Medical Device', 'Skin Care', 'Diabetes Care', 'Mobility Aid'];
const conditions = [{
  value: 'unopened',
  label: 'Unopened'
}, {
  value: 'sealed',
  label: 'Sealed'
}, {
  value: 'partially_used',
  label: 'Partially Used'
}, {
  value: 'used_device',
  label: 'Used Device'
}, {
  value: 'excellent',
  label: 'Excellent'
}, {
  value: 'good',
  label: 'Good'
}];
const inputClass = 'w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950';
function getItems(payload) {
  const page = payload?.data || {};
  return Array.isArray(page?.data) ? page.data : Array.isArray(payload?.data) ? payload.data : [];
}
const normalizePhone = phone => String(phone || '').replace(/[^\d+]/g, '');
function ExchangeCard({
  item,
  onContact,
  contacting
}) {
  const {
    t
  } = useTranslation("community");
  const image = item.images?.[0]?.path || item.image;
  const isDonation = item.ad_type === 'donation';
  return <article className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-md">
      <img src={resolveImageUrl(image) || FALLBACK_MEDICINE_IMAGE} alt={item.medicine_name} className="h-44 w-full object-cover" onError={event => withFallback(event, FALLBACK_MEDICINE_IMAGE)} />
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={isDonation ? getStatusBadgeClasses('paid') : getStatusBadgeClasses('pending')}>
            {isDonation ? t('listing.badge') : t('filters.resale')}
          </span>
          <span className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-700/70 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200">
            <BadgeCheck size={13} className="me-1" />{t('listing.pharmacistVerified')}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{item.medicine_name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.description || item.notes}</p>

        <div className="mt-4 grid gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>{item.category} / {getStatusLabel(item.condition)}</p>
          <p>{item.governorate} / {item.area}</p>
          <p>{t('listing.quantity')}{item.quantity}{t('listing.expires')}{item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}</p>
          <p>{t('listing.handledBy')}{item.assigned_pharmacy?.pharmacy_name || item.assignedPharmacy?.pharmacy_name || t('listing.verifiedPharmacy')}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{isDonation ? t('listing.communityPrice') : t('listing.requestedPrice')}</p>
            <p className={`text-lg font-extrabold ${isDonation ? 'text-emerald-700 dark:text-emerald-200' : 'text-slate-900 dark:text-slate-100'}`}>
              {isDonation ? t('listing.free') : formatPrice(item.price || 0)}
            </p>
          </div>
          <Button type="button" variant="secondary" disabled={contacting} onClick={() => onContact(item)}>
            {contacting ? t('listing.opening') : t('listing.contactPharmacy')}
          </Button>
        </div>
      </div>
    </article>;
}
function ContactPharmacyModal({
  contact,
  onClose
}) {
  const {
    t
  } = useTranslation("community");
  if (!contact) return null;
  const pharmacy = contact.pharmacy || {};
  const listing = contact.listing || {};
  const phone = normalizePhone(pharmacy.phone);
  const whatsappPhone = phone.startsWith('+') ? phone.replace('+', '') : phone;
  const whatsappMessage = encodeURIComponent(`Hello ${pharmacy.pharmacy_name || 'Pharmacy'}, I am interested in ${listing.medicine_name || 'this community listing'} on Shifa.`);
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl dark:shadow-slate-950/50">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <img src={resolveImageUrl(pharmacy.logo) || '/images/placeholders/pharmacy.svg'} onError={withFallback('/images/placeholders/pharmacy.svg')} alt={pharmacy.pharmacy_name || 'Pharmacy'} className="h-14 w-14 rounded-xl object-cover" />
            <div>
              <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-300">{t('contactModal.assignedPharmacy')}</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{pharmacy.pharmacy_name || t('contactModal.verifiedPharmacy')}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{listing.medicine_name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-5 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('contactModal.listing')}</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{listing.ad_type === 'donation' ? t('listing.badge') : t('filters.resale')} · {listing.category || t('contactModal.communityItem')}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"><Phone size={14} /> {t('contactModal.phone')}</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{pharmacy.phone || t('contactModal.notAvailable')}</p>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"><MapPin size={14} /> {t('contactModal.location')}</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{pharmacy.governorate || '-'} / {pharmacy.area || '-'}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('contactModal.address')}</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{pharmacy.address || t('contactModal.addressNotAvailable')}</p>
          </div>
          {pharmacy.working_hours ? <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('contactModal.workingHours')}</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{pharmacy.working_hours}</p>
            </div> : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 dark:border-slate-800 p-5">
          <Button type="button" variant="secondary" onClick={onClose}>{t('contactModal.close')}</Button>
          <Button type="button" variant="secondary" disabled={!phone} onClick={() => {
          window.location.href = `tel:${phone}`;
        }}>
            <span className="inline-flex items-center gap-2"><Phone size={15} />{t('contactModal.call')}</span>
          </Button>
          <Button type="button" disabled={!phone} onClick={() => window.open(`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`, '_blank', 'noopener,noreferrer')}>
            <span className="inline-flex items-center gap-2"><MessageCircle size={15} />{t('contactModal.whatsapp')}</span>
          </Button>
        </div>
      </div>
    </div>;
}
function CommunityMedicinesPage() {
  const {
    t
  } = useTranslation("community");
  const navigate = useNavigate();
  const {
    isAuthenticated,
    role,
    user
  } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    ad_type: '',
    category: '',
    governorate: '',
    area: '',
    pharmacy_id: '',
    free_only: false,
    page: 1
  });
  const [items, setItems] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 12
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [contactingId, setContactingId] = useState(null);
  const [contactDetails, setContactDetails] = useState(null);
  const [form, setForm] = useState({
    medicine_name: '',
    category: 'Medicine',
    description: '',
    reason: '',
    quantity: 1,
    expiration_date: '',
    condition: 'unopened',
    original_package_available: true,
    ad_type: 'donation',
    price: '',
    governorate: user?.governorate || 'Damascus',
    area: '',
    pickup_notes: '',
    notes: '',
    images: []
  });
  const availableFilterAreas = useMemo(() => filters.governorate ? GOVERNORATE_AREAS[filters.governorate] || [] : [], [filters.governorate]);
  const availableFormAreas = useMemo(() => form.governorate ? GOVERNORATE_AREAS[form.governorate] || [] : [], [form.governorate]);
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCommunityMedicines({
        search: filters.search || undefined,
        ad_type: filters.ad_type || undefined,
        category: filters.category || undefined,
        governorate: filters.governorate || undefined,
        area: filters.area || undefined,
        pharmacy_id: filters.pharmacy_id || undefined,
        free_only: filters.free_only ? 1 : undefined,
        page: filters.page,
        per_page: 12
      });
      const page = response?.data || response;
      const nextItems = getItems(page);
      setItems(nextItems);
      setPagination({
        currentPage: Number(page?.current_page || 1),
        lastPage: Number(page?.last_page || 1),
        total: Number(page?.total || nextItems.length),
        perPage: Number(page?.per_page || 12)
      });
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.unableToLoad'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useEffect(() => {
    let mounted = true;
    listMarketplacePharmacies({
      governorate: filters.governorate || undefined,
      area: filters.area || undefined,
      per_page: 100
    }).then(response => {
      if (!mounted) return;
      const payload = response?.data || {};
      setPharmacies(Array.isArray(payload?.data) ? payload.data : []);
    }).catch(() => {
      if (!mounted) return;
      setPharmacies([]);
    });
    return () => {
      mounted = false;
    };
  }, [filters.governorate, filters.area]);
  const submit = async event => {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/community-medicines'
        }
      });
      return;
    }
    if (role !== 'citizen') {
      toast.error(t('errors.onlyCustomerAccounts'));
      return;
    }
    if (form.ad_type === 'sale' && !form.price) {
      toast.warning(t('errors.priceRequired'));
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'images') return;
      if (key === 'original_package_available') fd.append(key, value ? '1' : '0');else if (value !== '' && value !== null && value !== undefined) fd.append(key, value);
    });
    for (const image of form.images) fd.append('images[]', image);
    setSubmitting(true);
    try {
      await createExchangeListing(fd);
      toast.success(t('errors.listingSubmitted'));
      setForm(prev => ({
        ...prev,
        medicine_name: '',
        description: '',
        reason: '',
        quantity: 1,
        expiration_date: '',
        price: '',
        pickup_notes: '',
        notes: '',
        images: []
      }));
      navigate('/my-community-medicines');
    } catch (err) {
      toast.error(err?.response?.data?.message || t('errors.unableToSubmit'));
    } finally {
      setSubmitting(false);
    }
  };
  const contactPharmacy = async item => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/community-medicines'
        }
      });
      return;
    }
    if (role !== 'citizen') {
      toast.error(t('errors.onlyCustomerContact'));
      return;
    }
    setContactingId(item.id);
    try {
      const response = await contactExchangePharmacy(item.id);
      setContactDetails(response?.data || null);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('errors.unableToOpenContact'));
    } finally {
      setContactingId(null);
    }
  };
  return <Container className="py-8 md:py-10">
      <section className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-7 text-white shadow-sm dark:shadow-slate-950/20 md:p-10">
        <p className="text-sm font-semibold text-blue-100">{t('hero.badge')}</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{t('hero.title')}</h1>
        <p className="mt-4 max-w-3xl text-sm text-blue-100 md:text-base">
          {t('hero.description')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#submit-listing"><Button className="bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40">{t('hero.buttons.submitListing')}</Button></a>
          {isAuthenticated && role === 'citizen' ? <Link to="/my-community-medicines"><Button variant="ghostOnDark">{t('hero.buttons.myListings')}</Button></Link> : null}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[[t('features.sameAreaReview.title'), t('features.sameAreaReview.description'), ShieldCheck], [t('features.pharmacistVerified.title'), t('features.pharmacistVerified.description'), PackageCheck], [t('features.donationOrResale.title'), t('features.donationOrResale.description'), HandHeart]].map(([title, body, Icon]) => <div key={title} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
            <Icon className="text-blue-600 dark:text-blue-300" size={22} />
            <h2 className="mt-3 font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
          </div>)}
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <div className="mb-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-slate-950/20">
            <div className="grid gap-3 md:grid-cols-7">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('filters.search')}</label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 px-3 py-2.5">
                  <Search size={16} className="text-slate-400 dark:text-slate-500" />
                  <input className="w-full bg-transparent text-sm outline-none" value={filters.search} onChange={e => setFilters(p => ({
                  ...p,
                  search: e.target.value,
                  page: 1
                }))} placeholder={t('filters.medicineNamePlaceholder')} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('filters.type')}</label>
                <select className={inputClass} value={filters.ad_type} onChange={e => setFilters(p => ({
                ...p,
                ad_type: e.target.value,
                page: 1
              }))}>
                  <option value="">{t('filters.all')}</option>
                  <option value="donation">{t('filters.donation')}</option>
                  <option value="sale">{t('filters.resale')}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Category</label>
                <select className={inputClass} value={filters.category} onChange={e => setFilters(p => ({
                ...p,
                category: e.target.value,
                page: 1
              }))}>
                  <option value="">{t('filters.all')}</option>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t("Governorate")}</label>
                <select className={inputClass} value={filters.governorate} onChange={e => setFilters(p => ({
                ...p,
                governorate: e.target.value,
                area: '',
                pharmacy_id: '',
                page: 1
              }))}>
                  <option value="">{t('filters.all')}</option>
                  {GOVERNORATES.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Area</label>
                <select className={inputClass} value={filters.area} disabled={!filters.governorate} onChange={e => setFilters(p => ({
                ...p,
                area: e.target.value,
                pharmacy_id: '',
                page: 1
              }))}>
                  <option value="">{t('filters.all')}</option>
                  {availableFilterAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('filters.pharmacy')}</label>
                <select className={inputClass} value={filters.pharmacy_id} onChange={e => setFilters(p => ({
                ...p,
                pharmacy_id: e.target.value,
                page: 1
              }))}>
                  <option value="">{t('filters.all')}</option>
                  {pharmacies.map(pharmacy => <option key={pharmacy.id} value={pharmacy.id}>{pharmacy.pharmacy_name}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={filters.free_only} onChange={e => setFilters(p => ({
                ...p,
                free_only: e.target.checked,
                page: 1
              }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 dark:text-blue-300" />
                {t('filters.freeOnly')}
              </label>
              <button type="button" onClick={() => setFilters({
              search: '',
              ad_type: '',
              category: '',
              governorate: '',
              area: '',
              pharmacy_id: '',
              free_only: false,
              page: 1
            })} className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">
                <RefreshCw size={15} />{t('filters.resetFilters')}
              </button>
            </div>
          </div>

          {error ? <div className="mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}
          {loading ? <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map(item => <div key={item} className="h-80 animate-pulse rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20" />)}
            </div> : items.length === 0 ? <EmptyState title={t('emptyStates.noPublishedMedicines')} description={t('emptyStates.noPublishedDescription')} /> : <>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map(item => <ExchangeCard key={item.id} item={item} onContact={contactPharmacy} contacting={contactingId === item.id} />)}
              </div>
              {pagination.total > pagination.perPage ? <Pagination currentPage={pagination.currentPage} totalPages={pagination.lastPage} onChange={page => setFilters(p => ({
            ...p,
            page
          }))} /> : null}
            </>}
        </div>

        <aside id="submit-listing" className="h-fit rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20 xl:sticky xl:top-24">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-300"><Gift size={20} /></span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('form.submitListing')}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('form.pharmaciesReview')}</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.listingType')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['donation', t('filters.donation'), HandHeart], ['sale', t('filters.resale'), Tag]].map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setForm(p => ({
                  ...p,
                  ad_type: value
                }))} className={`rounded-2xl border p-3 text-sm font-semibold transition ${form.ad_type === value ? 'border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 ring-4 ring-blue-100 dark:ring-blue-950' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:border-blue-700/70'}`}>
                      <Icon size={16} className="mx-auto mb-1" />
                      {label}
                    </button>)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.medicineProductName')}</label>
                <input className={inputClass} value={form.medicine_name} onChange={e => setForm(p => ({
                ...p,
                medicine_name: e.target.value
              }))} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.category')}</label>
                <select className={inputClass} value={form.category} onChange={e => setForm(p => ({
                ...p,
                category: e.target.value
              }))}>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.quantity')}</label>
                <input type="number" min="1" className={inputClass} value={form.quantity} onChange={e => setForm(p => ({
                ...p,
                quantity: e.target.value
              }))} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.expirationDate')}</label>
                <input type="date" className={inputClass} value={form.expiration_date} onChange={e => setForm(p => ({
                ...p,
                expiration_date: e.target.value
              }))} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.condition')}</label>
                <select className={inputClass} value={form.condition} onChange={e => setForm(p => ({
                ...p,
                condition: e.target.value
              }))}>
                  {conditions.map(condition => <option key={condition.value} value={condition.value}>{condition.label}</option>)}
                </select>
              </div>
              {form.ad_type === 'sale' ? <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.requestedPrice')}</label>
                  <input type="number" min="0" step="0.01" className={inputClass} value={form.price} onChange={e => setForm(p => ({
                ...p,
                price: e.target.value
              }))} />
                </div> : null}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.governorate')}</label>
                <select className={inputClass} value={form.governorate} onChange={e => setForm(p => ({
                ...p,
                governorate: e.target.value,
                area: ''
              }))}>
                  {GOVERNORATES.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.area')}</label>
                <select className={inputClass} value={form.area} onChange={e => setForm(p => ({
                ...p,
                area: e.target.value
              }))}>
                  <option value="">{t('form.selectArea')}</option>
                  {availableFormAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={form.original_package_available} onChange={e => setForm(p => ({
              ...p,
              original_package_available: e.target.checked
            }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 dark:text-blue-300" />{t('form.originalPackageAvailable')}
            </label>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.description')}</label>
              <textarea className={`${inputClass} min-h-24 resize-none`} value={form.description} onChange={e => setForm(p => ({
              ...p,
              description: e.target.value
            }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.reason')}</label>
              <textarea className={`${inputClass} min-h-20 resize-none`} value={form.reason} onChange={e => setForm(p => ({
              ...p,
              reason: e.target.value
            }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.pickupNotes')}</label>
              <textarea className={`${inputClass} min-h-20 resize-none`} value={form.pickup_notes} onChange={e => setForm(p => ({
              ...p,
              pickup_notes: e.target.value
            }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('form.images')}</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:border-blue-200 dark:border-blue-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40">
                <Camera size={16} className="text-blue-600 dark:text-blue-300" />
                <span>{form.images.length ? `${form.images.length} ${t('form.imagesSelected')}` : t('form.uploadImages')}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => setForm(p => ({
                ...p,
                images: Array.from(e.target.files || []).slice(0, 5)
              }))} />
              </label>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-xs leading-5 text-amber-800">
              {t('form.safetyNotice')}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? t('form.submitting') : t('form.submit')}
            </Button>
          </form>
        </aside>
      </section>

      <ContactPharmacyModal contact={contactDetails} onClose={() => setContactDetails(null)} />
    </Container>;
}
export default CommunityMedicinesPage;