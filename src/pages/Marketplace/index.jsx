import { useTranslation } from "react-i18next";
import { BadgeCheck, Percent, Search, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SectionTitle from '../../components/common/SectionTitle';
import PharmacyCard from '../../components/pharmacies/PharmacyCard';
import { GOVERNORATE_AREAS, GOVERNORATES } from '../../constants/locations';
import { getPublicFeedback } from '../../services/feedbackService';
import { listMarketplacePharmacies, listMarketplaceRewardCampaigns } from '../../services/pharmacyService';
import { FALLBACK_PHARMACY_IMAGE, resolveImageUrl, withFallback } from '../../utils/image';
function RewardCampaignDiscoveryCard({
  campaign
}) {
  const {
    t
  } = useTranslation("marketplace");
  const p = campaign.pharmacy;
  const cats = Array.isArray(campaign.eligible_categories) ? campaign.eligible_categories.join(', ') : '';
  return <article className="card-lift overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20">
      <img src={resolveImageUrl(p?.logo) || FALLBACK_PHARMACY_IMAGE} alt={campaign.title} className="h-40 w-full object-cover" onError={event => withFallback(event, FALLBACK_PHARMACY_IMAGE)} />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{campaign.title}</h3>
          <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">{campaign.reward_percentage}%</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{campaign.description || t('campaigns.card.defaultDescription')}</p>
        <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <p>{p?.pharmacy_name || t('campaigns.card.pharmacyLabel')}</p>
          <p>{[p?.governorate, p?.area].filter(Boolean).join(' • ')}</p>
          <p>{t('campaigns.card.rule')}{campaign.required_purchase_count}{t('campaigns.card.ordersGte')}{Number(campaign.minimum_order_amount).toFixed(2)}{t('campaigns.card.currency')}</p>
          {cats ? <p>{t('campaigns.card.eligible')}{cats}</p> : null}
        </div>
        <div className="mt-4 flex gap-2">
          <Link to={`/pharmacies/${p?.id}`} className="flex-1">
            <Button className="w-full">{t('campaigns.card.viewPharmacy')}</Button>
          </Link>
        </div>
      </div>
    </article>;
}
function MarketplacePage() {
  const {
    t
  } = useTranslation("marketplace");
  const [governorate, setGovernorate] = useState('');
  const [area, setArea] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignPagination, setCampaignPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 12
  });
  const [topRatedPharmacies, setTopRatedPharmacies] = useState([]);
  const [featuredPharmacies, setFeaturedPharmacies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const availableAreas = useMemo(() => governorate ? GOVERNORATE_AREAS[governorate] || [] : [], [governorate]);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    Promise.all([listMarketplaceRewardCampaigns({
      governorate: governorate || undefined,
      area: area || undefined,
      search: search || undefined,
      page,
      per_page: 12,
      sort: 'newest'
    }), listMarketplacePharmacies({
      governorate: governorate || undefined,
      area: area || undefined,
      search: search || undefined,
      sort: 'rating_desc',
      per_page: 6
    }), listMarketplacePharmacies({
      governorate: governorate || undefined,
      area: area || undefined,
      search: search || undefined,
      sort: 'campaigns_desc',
      per_page: 6
    }), getPublicFeedback()]).then(([campaignsRes, topRatedRes, featuredRes, reviewsRes]) => {
      if (!mounted) return;
      const campaignsPayload = campaignsRes?.data || {};
      const topRatedPayload = topRatedRes?.data || {};
      const featuredPayload = featuredRes?.data || {};
      const reviewPayload = reviewsRes?.data || reviewsRes || [];
      const campaignItems = Array.isArray(campaignsPayload?.data) ? campaignsPayload.data : [];
      setCampaigns(campaignItems);
      setCampaignPagination({
        currentPage: Number(campaignsPayload?.current_page || 1),
        lastPage: Number(campaignsPayload?.last_page || 1),
        total: Number(campaignsPayload?.total || campaignItems.length),
        perPage: Number(campaignsPayload?.per_page || 12)
      });
      setTopRatedPharmacies(Array.isArray(topRatedPayload?.data) ? topRatedPayload.data : []);
      setFeaturedPharmacies(Array.isArray(featuredPayload?.data) ? featuredPayload.data : []);
      setReviews(Array.isArray(reviewPayload) ? reviewPayload : []);
    }).catch(err => {
      if (!mounted) return;
      setError(err?.response?.data?.message || 'Unable to load marketplace discovery sections.');
    }).finally(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [governorate, area, search, page]);
  const topRewardCampaigns = useMemo(() => [...campaigns].sort((a, b) => Number(b.reward_percentage || 0) - Number(a.reward_percentage || 0)).slice(0, 4), [campaigns]);
  return <Container className="py-10">
      <section className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-7 text-white shadow-sm dark:shadow-slate-950/20 md:p-10">
        <p className="text-sm font-semibold text-blue-100">{t('hero.badge')}</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{t('hero.title')}</h1>
        <p className="mt-4 max-w-3xl text-sm text-blue-100 md:text-base">
          {t('hero.description')}
        </p>
        <div className="mt-6 grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-blue-100">{t('hero.filters.search')}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white dark:bg-slate-900/95 px-3 py-2 text-slate-700 dark:text-slate-200">
              <Search size={16} className="text-slate-400 dark:text-slate-500" />
              <input value={search} onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }} placeholder={t('hero.filters.searchPlaceholder')} className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-blue-100">{t('hero.filters.governorate')}</label>
            <select value={governorate} onChange={e => {
            setGovernorate(e.target.value);
            setArea('');
            setPage(1);
          }} className="w-full rounded-2xl border border-white/20 bg-white dark:bg-slate-900/95 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none">
              <option value="">{t('hero.filters.allGovernorates')}</option>
              {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-blue-100">{t('hero.filters.area')}</label>
            <select value={area} disabled={!governorate} onChange={e => {
            setArea(e.target.value);
            setPage(1);
          }} className="w-full rounded-2xl border border-white/20 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-200 dark:bg-slate-900/95 dark:text-slate-200 dark:disabled:bg-slate-700">
              <option value="">{governorate ? t('hero.filters.allAreas') : t('hero.filters.selectGovernorateFirst')}</option>
              {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="button" onClick={() => {
            setGovernorate('');
            setArea('');
            setSearch('');
            setPage(1);
          }} className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">{t('hero.buttons.reset')}</button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/pharmacies"><Button variant="light">{t('hero.buttons.browsePharmacies')}</Button></Link>
          <Link to="/about"><Button variant="ghostOnDark">{t('hero.buttons.healthcareCampaigns')}</Button></Link>
        </div>
      </section>

      {error ? <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-200">{t('error')}</div> : null}

      <section className="mt-12">
        <SectionTitle eyebrow={t('campaigns.eyebrow')} title={t('campaigns.sectionTitle')} />
        {loading ? <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-sm text-slate-600 dark:text-slate-300">{t('campaigns.loading')}</div> : campaigns.length === 0 ? <EmptyState title={t('campaigns.emptyState')} description={t('campaigns.emptyStateDescription')} /> : <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {campaigns.map(c => <RewardCampaignDiscoveryCard key={c.id} campaign={c} />)}
            </div>
            {campaignPagination.total > campaignPagination.perPage ? <Pagination currentPage={campaignPagination.currentPage} totalPages={campaignPagination.lastPage} onChange={setPage} /> : null}
          </>}
      </section>

      <section className="mt-12">
        <SectionTitle eyebrow={t('topRewards.eyebrow')} title={t('topRewards.sectionTitle')} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topRewardCampaigns.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-sm text-slate-500 dark:text-slate-400">{t('topRewards.emptyState')}</div> : topRewardCampaigns.map(c => <article key={c.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
              <div className="mb-3 inline-flex rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2 text-blue-600 dark:text-blue-300"><Percent size={16} /></div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{c.description || t('topRewards.card.defaultDescription')}</p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{c.pharmacy?.pharmacy_name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.reward_percentage}{t('campaigns.card.cosmeticsOnly')}</p>
            </article>)}
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle eyebrow={t('topRated.eyebrow')} title={t('topRated.sectionTitle')} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topRatedPharmacies.map(pharmacy => <div key={pharmacy.id} className="relative">
              <div className="absolute start-3 top-3 z-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-200">
                <BadgeCheck size={12} className="me-1 inline-block" />{t('topRated.badge')}</div>
              <PharmacyCard pharmacy={pharmacy} />
            </div>)}
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle eyebrow={t('featured.eyebrow')} title={t('featured.sectionTitle')} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredPharmacies.map(pharmacy => <div key={pharmacy.id} className="relative">
              <div className="absolute start-3 top-3 z-10 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-200">{t('featured.badge')}</div>
              <PharmacyCard pharmacy={pharmacy} />
            </div>)}
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle eyebrow={t('reviews.eyebrow')} title={t('reviews.sectionTitle')} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviews.slice(0, 6).map(review => <article key={review.id} className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{review.name}</p>
                <div className="flex gap-0.5">
                  {Array.from({
                length: 5
              }).map((_, i) => <Star key={`${review.id}-${i}`} size={14} className={i + 1 <= Number(review.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />)}
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{review.message}</p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
            </article>)}
        </div>
      </section>

      <section className="mt-12 rounded-3xl bg-blue-950 p-7 text-white shadow-sm dark:shadow-slate-950/20 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold md:text-3xl">{t('cta.title')}</h2>
            <p className="mt-3 text-sm text-blue-100 md:text-base">
              {t('cta.description')}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/pharmacies" className="w-full sm:w-auto">
              <Button variant="light" className="w-full">{t('cta.browsePharmacies')}</Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="ghostOnDark" className="w-full">{t('cta.createAccount')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </Container>;
}
export default MarketplacePage;