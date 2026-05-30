import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import MedicineFilters from '../../components/medicines/MedicineFilters';
import MedicineGrid from '../../components/medicines/MedicineGrid';
import Pagination from '../../components/common/Pagination';
import SectionTitle from '../../components/common/SectionTitle';
import { listMarketplacePharmacies } from '../../services/pharmacyService';
import { getAllMedicines } from '../../services/medicineService';
import { GOVERNORATES } from '../../constants/locations';
function MedicinesPage() {
  const {
    t
  } = useTranslation("medicines");
  const sectionRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const filters = useMemo(() => ({
    name: (searchParams.get('search') || '').trim(),
    category: searchParams.get('category') || '',
    governorate: searchParams.get('governorate') || searchParams.get('city') || '',
    pharmacy_id: searchParams.get('pharmacy_id') || '',
    stock: searchParams.get('stock') || 'all',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page') || '1') || 1
  }), [searchParams]);
  useEffect(() => {
    let mounted = true;
    listMarketplacePharmacies({
      per_page: 100
    }).then(res => {
      if (!mounted) return;
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setPharmacies(items);
    }).catch(() => {
      if (!mounted) return;
      setPharmacies([]);
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    getAllMedicines({
      name: filters.name || undefined,
      category: filters.category || undefined,
      governorate: filters.governorate || undefined,
      pharmacy_id: filters.pharmacy_id || undefined,
      stock: filters.stock || 'all',
      sort: filters.sort || 'newest',
      page: filters.page || 1
    }).then(res => {
      if (!mounted) return;
      setResponse(res);
    }).catch(err => {
      if (!mounted) return;
      setError(err?.response?.data?.message || 'Unable to load medicines.');
      setResponse(null);
    }).finally(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [filters.name, filters.category, filters.governorate, filters.pharmacy_id, filters.stock, filters.sort, filters.page]);
  const paginated = response?.data || {};
  const medicinesPayload = paginated?.medicines || paginated;
  const medicines = Array.isArray(medicinesPayload?.data) ? medicinesPayload.data : [];
  const categories = Array.isArray(paginated?.categories) ? paginated.categories : [];
  const currentPage = Number(medicinesPayload?.current_page || 1);
  const totalPages = Number(medicinesPayload?.last_page || 1);
  const total = Number(medicinesPayload?.total || 0);
  const updateQuery = (patch, resetPage = false) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      const normalized = value == null ? '' : String(value);
      if (normalized === '' || normalized === 'all') {
        next.delete(key);
      } else {
        next.set(key, normalized);
      }
    });
    if (resetPage) next.set('page', '1');
    setSearchParams(next);
  };
  const onPageChange = page => {
    updateQuery({
      page
    }, false);
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  const renderSkeleton = () => <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({
      length: 12
    }).map((_, idx) => <div key={idx} className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20">
          <div className="h-44 animate-pulse bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-10 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>)}
    </div>;
  return <Container className="py-10">
      <div ref={sectionRef}>
        <SectionTitle title="Medicines" />

        <MedicineFilters categories={categories} />

      <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Search medicines</label>
          <input value={filters.name} onChange={e => updateQuery({
            search: e.target.value
          }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t("Search by medicine name...")} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t("Governorate")}</label>
          <select value={filters.governorate} onChange={e => updateQuery({
            governorate: e.target.value,
            city: ''
          }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
            <option value="">All governorates</option>
            {GOVERNORATES.map(gov => <option key={gov} value={gov}>
                {gov}
              </option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Pharmacy</label>
          <select value={filters.pharmacy_id} onChange={e => updateQuery({
            pharmacy_id: e.target.value
          }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
            <option value="">All pharmacies</option>
            {pharmacies.map(pharmacy => <option key={pharmacy.id} value={pharmacy.id}>
                {pharmacy.pharmacy_name}
              </option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t("Stock")}</label>
          <select value={filters.stock} onChange={e => updateQuery({
            stock: e.target.value
          }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
            <option value="all">All stock</option>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock (&lt;= 10)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Sort</label>
          <select value={filters.sort} onChange={e => updateQuery({
            sort: e.target.value
          }, true)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
            <option value="newest">{t("Newest")}</option>
            <option value="price_asc">{t("Price: Low to High")}</option>
            <option value="price_desc">{t("Price: High to Low")}</option>
            <option value="name_asc">{t("Name: A - Z")}</option>
            <option value="name_desc">{t("Name: Z - A")}</option>
          </select>
        </div>
      </div>

      {loading ? renderSkeleton() : null}

      {!loading && error ? <div className="rounded-2xl border border-rose-100 bg-rose-50 dark:bg-rose-950/40 p-6 text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}

      {!loading && !error && medicines.length === 0 ? <EmptyState title={t("No medicines found")} description="Try changing your filters, pharmacy selection, or search query." /> : null}

      {!loading && !error && medicines.length > 0 ? <>
          <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">{t("Showing")}{medicines.length}{t("of")}{total}{t("medicines")}</div>
          <MedicineGrid medicines={medicines} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </> : null}

        <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">{t("12 medicines per page")}</div>
      </div>
    </Container>;
}
export default MedicinesPage;