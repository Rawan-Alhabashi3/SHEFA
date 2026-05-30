import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import SectionTitle from '../../components/common/SectionTitle';
import Pagination from '../../components/common/Pagination';
import MedicineGrid from '../../components/medicines/MedicineGrid';
import { getMarketplacePharmacy } from '../../services/pharmacyService';
import { FALLBACK_PHARMACY_IMAGE, resolveImageUrl, withFallback } from '../../utils/image';
function PharmacyDetailsPage() {
  const {
    t
  } = useTranslation("pharmacy");
  const {
    id
  } = useParams();
  const pharmacyId = String(id || '');
  const medicinesSectionRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetchingMedicines, setIsFetchingMedicines] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('all');
  const [sort, setSort] = useState('name_asc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;
  useEffect(() => {
    let mounted = true;
    const initialLoad = !data;
    if (initialLoad) {
      setLoading(true);
    } else {
      setIsFetchingMedicines(true);
    }
    setError('');
    getMarketplacePharmacy(pharmacyId, {
      search,
      category,
      stock,
      sort,
      page,
      per_page: PER_PAGE
    }).then(res => {
      const payload = res?.data || res;
      if (!mounted) return;
      setData(payload);
    }).catch(err => {
      if (!mounted) return;
      setError(err?.response?.data?.message || 'Unable to load pharmacy.');
      setData(null);
    }).finally(() => {
      if (!mounted) return;
      if (initialLoad) {
        setLoading(false);
      } else {
        setIsFetchingMedicines(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [pharmacyId, search, category, stock, sort, page]);
  const pharmacy = data?.data?.pharmacy || data?.pharmacy;
  const medicinesPagination = data?.data?.medicines || data?.medicines || {};
  const medicines = useMemo(() => Array.isArray(medicinesPagination?.data) ? medicinesPagination.data : Array.isArray(medicinesPagination) ? medicinesPagination : [], [medicinesPagination]);
  const categories = useMemo(() => Array.isArray(data?.data?.categories) ? data.data.categories : Array.isArray(data?.categories) ? data.categories : [], [data]);
  const currentPage = Number(medicinesPagination?.current_page || 1);
  const totalPages = Number(medicinesPagination?.last_page || 1);
  const total = Number(medicinesPagination?.total || medicines.length || 0);
  const handleFilterChange = setter => event => {
    setter(event.target.value);
    setPage(1);
  };
  const handlePageChange = nextPage => {
    setPage(nextPage);
    medicinesSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return <Container className="py-10">
      <SectionTitle title={pharmacy?.pharmacy_name || t('details.title')} />

      {loading ? <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-sm text-slate-600 dark:text-slate-300">{t('details.loading')}</div> : error ? <div className="rounded-2xl border border-rose-100 bg-rose-50 dark:bg-rose-950/40 p-6 text-sm text-rose-700 dark:text-rose-200">{error}</div> : !pharmacy ? <EmptyState title={t('details.notFound')} description={t('details.notFoundDescription')} /> : <>
          <div className="mb-6 grid gap-4 rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20 md:grid-cols-[88px_1fr]">
            <img src={resolveImageUrl(pharmacy.logo) || FALLBACK_PHARMACY_IMAGE} alt={pharmacy.pharmacy_name} className="h-20 w-20 rounded-2xl object-cover" onError={event => withFallback(event, FALLBACK_PHARMACY_IMAGE)} />
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{pharmacy.pharmacy_name}</h2>
                {Number(pharmacy.active_campaigns_count || 0) > 0 ? <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200">{t('details.badges.rewardCampaigns')}</span> : null}
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{[pharmacy.governorate, pharmacy.address].filter(Boolean).join(' • ')}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pharmacy.working_hours || t('details.info.workingHours')}</p>
            </div>
          </div>

          <div ref={medicinesSectionRef} className="mb-6 grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('details.filters.searchMedicines')}</label>
              <input value={search} onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('Type a medicine name...')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('details.filters.category')}</label>
              <select value={category} onChange={handleFilterChange(setCategory)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
                <option value="">{t('details.filters.all')}</option>
                {categories.map(c => <option key={c} value={c}>
                    {c}
                  </option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('details.filters.stock')}</label>
              <select value={stock} onChange={handleFilterChange(setStock)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
                <option value="all">{t('details.filters.allStock')}</option>
                <option value="in_stock">{t('details.filters.inStock')}</option>
                <option value="low_stock">{t('details.filters.lowStock')}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('details.filters.sort')}</label>
              <select value={sort} onChange={handleFilterChange(setSort)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
                <option value="name_asc">{t('details.sortOptions.nameAsc')}</option>
                <option value="name_desc">{t('details.sortOptions.nameDesc')}</option>
                <option value="price_asc">{t('details.sortOptions.priceLowToHigh')}</option>
                <option value="price_desc">{t('details.sortOptions.priceHighToLow')}</option>
                <option value="newest">{t('details.sortOptions.newest')}</option>
              </select>
            </div>
          </div>

          {medicines.length === 0 ? <EmptyState title={t('details.emptyStates.noMedicinesAvailable')} description={t('details.emptyStates.noMedicinesAvailableDescription')} /> : <>
              <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">{t('details.pagination.showing')} {medicines.length} {t('details.pagination.of')} {total} {t('details.pagination.medicines')}</div>
              <MedicineGrid medicines={medicines} />
              <Pagination currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
            </>}
          {isFetchingMedicines ? <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">{t('details.loadingMedicines')}</div> : null}
          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">{t('details.pagination.perPage')}</div>
        </>}
    </Container>;
}
export default PharmacyDetailsPage;