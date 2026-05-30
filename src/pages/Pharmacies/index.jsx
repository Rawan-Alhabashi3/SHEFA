import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import SectionTitle from '../../components/common/SectionTitle';
import PharmacyGrid from '../../components/pharmacies/PharmacyGrid';
import { listMarketplacePharmacies } from '../../services/pharmacyService';
import { GOVERNORATE_AREAS, GOVERNORATES } from '../../constants/locations';
function PharmaciesPage() {
  const {
    t
  } = useTranslation("pharmacy");
  const sectionRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [location, setLocation] = useState({
    governorate: '',
    area: ''
  });
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState('name_asc');
  const [page, setPage] = useState(1);
  const [pharmacies, setPharmacies] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const governorate = searchParams.get('governorate') || '';
    const area = searchParams.get('area') || '';
    const search = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || 'name_asc';
    const currentPage = Number(searchParams.get('page') || '1') || 1;
    setLocation({
      governorate,
      area
    });
    setSearchInput(search);
    setSort(currentSort);
    setPage(currentPage);
    try {
      localStorage.setItem('shifa_location', JSON.stringify({
        governorate,
        area
      }));
    } catch {
      // ignore
    }
  }, [searchParams]);
  const updateParams = (patch, resetPage = false) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      const normalized = value == null ? '' : String(value);
      if (!normalized) next.delete(key);else next.set(key, normalized);
    });
    if (resetPage) next.set('page', '1');
    setSearchParams(next);
  };
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    listMarketplacePharmacies({
      governorate: location.governorate || undefined,
      area: location.area || undefined,
      search: searchInput || undefined,
      sort: sort || undefined,
      page: page || 1,
      per_page: 12
    }).then(res => {
      const payload = res?.data || {};
      const items = Array.isArray(payload?.data) ? payload.data : [];
      if (!mounted) return;
      setPharmacies(items);
      setPagination({
        currentPage: Number(payload?.current_page || 1),
        lastPage: Number(payload?.last_page || 1),
        perPage: Number(payload?.per_page || 12),
        total: Number(payload?.total || items.length)
      });
    }).catch(err => {
      if (!mounted) return;
      setError(err?.response?.data?.message || 'Unable to load pharmacies right now.');
      setPharmacies([]);
      setPagination({
        currentPage: 1,
        lastPage: 1,
        perPage: 12,
        total: 0
      });
    }).finally(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [location.governorate, location.area, searchInput, sort, page]);
  const filteredPharmacies = useMemo(() => pharmacies, [pharmacies]);
  const availableAreas = useMemo(() => {
    if (!location.governorate) return [];
    return GOVERNORATE_AREAS[location.governorate] || [];
  }, [location.governorate]);
  return <Container className="py-10">
      <div ref={sectionRef}>
        <SectionTitle title={t('listing.title')} />
      </div>
      <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('listing.filters.governorate')}</label>
          <select value={location.governorate} onChange={e => updateParams({
          governorate: e.target.value,
          area: ''
        }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
            <option value="">{t('listing.filters.all')}</option>
            {GOVERNORATES.map(g => <option key={g} value={g}>
                {g}
              </option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('listing.filters.area')}</label>
          <select value={location.area || ''} disabled={!location.governorate} onChange={e => updateParams({
          area: e.target.value
        }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-800">
            <option value="">{location.governorate ? t('listing.filters.allAreas') : t('listing.filters.selectGovernorateFirst')}</option>
            {availableAreas.map(a => <option key={a} value={a}>
                {a}
              </option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('listing.filters.search')}</label>
          <input value={searchInput} onChange={e => updateParams({
          search: e.target.value
        }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('listing.searchPlaceholder')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('listing.filters.sort')}</label>
          <select value={sort} onChange={e => updateParams({
          sort: e.target.value
        }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
            <option value="name_asc">{t('listing.sortOptions.nameAsc')}</option>
            <option value="name_desc">{t('listing.sortOptions.nameDesc')}</option>
            <option value="rating_desc">{t('listing.sortOptions.topRated')}</option>
            <option value="campaigns_desc">{t('listing.sortOptions.mostRewardCampaigns')}</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" onClick={() => setSearchParams(new URLSearchParams())} className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">{t('listing.buttons.resetFilters')}</button>
        </div>
      </div>

      {loading ? <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-sm text-slate-600 dark:text-slate-300">{t('listing.loading')}</div> : error ? <div className="rounded-2xl border border-rose-100 bg-rose-50 dark:bg-rose-950/40 p-6 text-sm text-rose-700 dark:text-rose-200">{error}</div> : filteredPharmacies.length === 0 ? <EmptyState title={t('listing.emptyStates.noPharmaciesFound')} description={t('listing.emptyStates.noPharmaciesFoundDescription')} /> : <>
          <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">{t('listing.pagination.showing')} {filteredPharmacies.length} {t('listing.pagination.of')} {pagination.total} {t('listing.pagination.pharmacies')}</div>
          <PharmacyGrid pharmacies={filteredPharmacies} />
          {pagination.total > pagination.perPage ? <Pagination currentPage={pagination.currentPage} totalPages={pagination.lastPage} onChange={nextPage => {
        updateParams({
          page: nextPage
        }, false);
        sectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }} /> : null}
        </>}
    </Container>;
}
export default PharmaciesPage;