import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Gift, Pencil, Plus, Search, Tag, Trash2, ToggleLeft, ToggleRight, X, ChevronDown, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DashboardStatCard from '../../components/common/DashboardStatCard';
import { createPharmacyCouponCampaign, deletePharmacyCouponCampaign, getPharmacyCouponCampaignAnalytics, listPharmacyCouponCampaigns, listPharmacyIssuedCoupons, togglePharmacyCouponCampaign, updatePharmacyCouponCampaign, listPharmacyCouponCampaignCategories } from '../../services/pharmacyService';
import { formatPrice } from '../../utils/format';

/**
 * Laravel `SuccessResponse` returns `{ data, message, code }`.
 * Paginated endpoints put rows in `body.data.data` (LengthAwarePaginator).
 * Some endpoints may return a bare array in `body.data`.
 */
function unwrapPharmacyListPayload(body) {
  const inner = body?.data;
  if (inner == null) return [];
  if (Array.isArray(inner)) return inner;
  if (Array.isArray(inner?.data)) return inner.data;
  return [];
}
const emptyForm = {
  title: '',
  description: '',
  required_purchase_count: 2,
  minimum_order_amount: 50,
  reward_percentage: 20,
  eligible_categories: [],
  expiration_days: 30,
  is_active: true
};

function CategoryMultiSelect({ categories, selectedIds, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { i18n } = useTranslation();

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCategories = categories.filter(cat => selectedIds.includes(cat.id));

  const toggleCategory = (categoryId) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter(id => id !== categoryId));
    } else {
      onChange([...selectedIds, categoryId]);
    }
  };

  const removeCategory = (categoryId) => {
    onChange(selectedIds.filter(id => id !== categoryId));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCategories.map(cat => (
          <span
            key={cat.id}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 rounded-full text-sm font-medium"
          >
            {cat.name}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeCategory(cat.id)}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >
                <X size={14} />
              </button>
            )}
          </span>
        ))}
        {selectedCategories.length === 0 && (
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {i18n.language === 'ar' ? 'اختر الفئات' : 'Select categories'}
          </span>
        )}
      </div>

      {!disabled && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border rounded-xl text-sm bg-white dark:bg-slate-900 dark:border-slate-700"
          >
            <span>{i18n.language === 'ar' ? 'إضافة فئات' : 'Add categories'}</span>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-hidden">
              <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={i18n.language === 'ar' ? 'بحث...' : 'Search...'}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredCategories.length === 0 ? (
                  <div className="p-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                    {i18n.language === 'ar' ? 'لا توجد فئات' : 'No categories found'}
                  </div>
                ) : (
                  filteredCategories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        toggleCategory(cat.id);
                        setSearch('');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedIds.includes(cat.id)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {selectedIds.includes(cat.id) && <Check size={12} />}
                      </div>
                      <span className="flex-1 text-left">{cat.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function CampaignModal({
  mode,
  campaign,
  onClose,
  onSaved
}) {
  const {
    t
  } = useTranslation("pharmacy");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [form, setForm] = useState(() => {
    if (!campaign) return emptyForm;
    return {
      title: campaign.title || '',
      description: campaign.description || '',
      required_purchase_count: campaign.required_purchase_count ?? 2,
      minimum_order_amount: campaign.minimum_order_amount ?? 0,
      reward_percentage: campaign.reward_percentage ?? 15,
      eligible_categories: Array.isArray(campaign.eligible_categories) 
        ? campaign.eligible_categories.filter(id => typeof id === 'number')
        : [],
      expiration_days: campaign.expiration_days ?? 30,
      is_active: Boolean(campaign.is_active)
    };
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await listPharmacyCouponCampaignCategories();
        setCategories(response?.data?.data ?? response?.data ?? []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const setField = (k, v) => setForm(p => ({
    ...p,
    [k]: v
  }));
  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = t('coupons.modal.validation.titleRequired');
    if (Number(form.required_purchase_count) < 1) next.required_purchase_count = t('coupons.modal.validation.requiredPurchaseCountMin');
    if (Number(form.minimum_order_amount) < 0) next.minimum_order_amount = t('coupons.modal.validation.minimumOrderAmountNegative');
    if (Number(form.reward_percentage) < 1 || Number(form.reward_percentage) > 90) next.reward_percentage = t('coupons.modal.validation.rewardPercentageRange');
    if (Number(form.expiration_days) < 1) next.expiration_days = t('coupons.modal.validation.expirationDaysMin');
    if (form.eligible_categories.length === 0) next.eligible_categories = t('coupons.modal.validation.eligibleCategoriesRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = async e => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      required_purchase_count: Number(form.required_purchase_count),
      minimum_order_amount: Number(form.minimum_order_amount),
      reward_percentage: Number(form.reward_percentage),
      eligible_categories: form.eligible_categories,
      expiration_days: Number(form.expiration_days),
      is_active: form.is_active
    };
    setSaving(true);
    try {
      if (mode === 'edit' && campaign?.id) {
        await updatePharmacyCouponCampaign(campaign.id, payload);
      } else {
        await createPharmacyCouponCampaign(payload);
      }
      await onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl dark:shadow-slate-950/40">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{mode === 'edit' ? t('coupons.modal.editCampaign') : t('coupons.modal.newRewardCampaign')}</h3>
          <button type="button" className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          {t('coupons.modal.description')}
        </p>
        <div className="grid gap-3">
          <label>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('coupons.modal.form.campaignTitle')}</span>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" value={form.title} onChange={e => setField('title', e.target.value)} />
            {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title}</p> : null}
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('coupons.modal.form.description')}</span>
            <textarea className="mt-1 h-20 w-full rounded-xl border px-3 py-2 text-sm" value={form.description} onChange={e => setField('description', e.target.value)} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('coupons.modal.form.requiredDeliveredOrders')}</span>
              <input type="number" min="1" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" value={form.required_purchase_count} onChange={e => setField('required_purchase_count', e.target.value)} />
              {errors.required_purchase_count ? <p className="mt-1 text-xs text-rose-600">{errors.required_purchase_count}</p> : null}
            </label>
            <label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('coupons.modal.form.minimumOrderAmount')}</span>
              <input type="number" min="0" step="0.01" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" value={form.minimum_order_amount} onChange={e => setField('minimum_order_amount', e.target.value)} />
              {errors.minimum_order_amount ? <p className="mt-1 text-xs text-rose-600">{errors.minimum_order_amount}</p> : null}
            </label>
            <label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('coupons.modal.form.rewardPercentage')}</span>
              <input type="number" min="1" max="90" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" value={form.reward_percentage} onChange={e => setField('reward_percentage', e.target.value)} />
              {errors.reward_percentage ? <p className="mt-1 text-xs text-rose-600">{errors.reward_percentage}</p> : null}
            </label>
            <label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('coupons.modal.form.couponValidDays')}</span>
              <input type="number" min="1" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" value={form.expiration_days} onChange={e => setField('expiration_days', e.target.value)} />
              {errors.expiration_days ? <p className="mt-1 text-xs text-rose-600">{errors.expiration_days}</p> : null}
            </label>
          </div>
          <label>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('coupons.modal.form.eligibleCategories')}</span>
            {loadingCategories ? (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Loading categories...</p>
            ) : (
              <CategoryMultiSelect
                categories={categories}
                selectedIds={form.eligible_categories}
                onChange={(ids) => setField('eligible_categories', ids)}
                disabled={saving}
              />
            )}
            {errors.eligible_categories ? <p className="mt-1 text-xs text-rose-600">{errors.eligible_categories}</p> : null}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.is_active} onChange={e => setField('is_active', e.target.checked)} />
            {t('coupons.modal.form.campaignActive')}
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950" onClick={onClose}>{t('coupons.modal.buttons.cancel')}</Button>
          <Button type="submit" disabled={saving}>{saving ? t('coupons.modal.buttons.saving') : t('coupons.modal.buttons.saveCampaign')}</Button>
        </div>
      </form>
    </div>;
}
export default function PharmacyCouponCampaignsPage() {
  const {
    t
  } = useTranslation("pharmacy");
  const [analytics, setAnalytics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [issued, setIssued] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuedStatus, setIssuedStatus] = useState('active');
  const [page, setPage] = useState(1);
  const [issuedPage, setIssuedPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await listPharmacyCouponCampaignCategories();
        setCategories(response?.data?.data ?? response?.data ?? []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, c, ic] = await Promise.all([getPharmacyCouponCampaignAnalytics(), listPharmacyCouponCampaigns({
        page,
        per_page: 8,
        search: search.trim() || undefined
      }), listPharmacyIssuedCoupons({
        status: issuedStatus,
        page: issuedPage,
        per_page: 8
      })]);
      const aPayload = a?.data?.data ?? a?.data ?? {};
      setAnalytics(aPayload);
      setCampaigns(unwrapPharmacyListPayload(c));
      setIssued(unwrapPharmacyListPayload(ic));
    } finally {
      setLoading(false);
    }
  }, [page, search, issuedPage, issuedStatus]);
  useEffect(() => {
    load();
  }, [load]);
  const stats = useMemo(() => {
    if (!analytics) return [];
    return [{
      label: t('coupons.stats.activeCampaigns'),
      value: analytics.active_campaigns ?? 0,
      icon: Tag
    }, {
      label: t('coupons.stats.couponsIssued'),
      value: analytics.coupons_issued ?? 0,
      icon: Gift
    }, {
      label: t('coupons.stats.redeemed'),
      value: analytics.coupons_redeemed ?? 0,
      icon: Gift
    }, {
      label: t('coupons.stats.activeCoupons'),
      value: analytics.coupons_active ?? 0,
      icon: Gift
    }];
  }, [analytics]);
  const getCategoryNames = (eligibleCategories) => {
    if (!eligibleCategories) return [];
    
    // Handle backward compatibility: if it's an array of strings (old format), display as is
    if (Array.isArray(eligibleCategories) && eligibleCategories.length > 0) {
      if (typeof eligibleCategories[0] === 'string') {
        return eligibleCategories;
      }
      // New format: array of category IDs
      return eligibleCategories
        .map(id => categories.find(cat => cat.id === id)?.name)
        .filter(Boolean);
    }
    
    return [];
  };

  const onDelete = async id => {
    if (!window.confirm(t('coupons.modal.confirmDelete'))) return;
    await deletePharmacyCouponCampaign(id);
    load();
  };
  const onToggle = async id => {
    await togglePharmacyCouponCampaign(id);
    load();
  };
  return <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">{t('coupons.loyalty')}</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('coupons.title')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('coupons.description')}</p>
        </div>
        <Button onClick={() => setModal({
        mode: 'create'
      })} className="inline-flex items-center gap-2">
          <Plus size={16} />{t('coupons.newCampaign')}</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => <DashboardStatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />)}
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('coupons.campaigns.title')}</h2>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-slate-400 dark:text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('coupons.campaigns.searchPlaceholder')} className="rounded-full border px-3 py-1.5 text-sm" />
            <Button type="button" className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950" onClick={() => {
            setPage(1);
            load();
          }}>{t('coupons.campaigns.apply')}</Button>
          </div>
        </div>
        {loading ? <p className="text-sm text-slate-500 dark:text-slate-400">{t('coupons.campaigns.loading')}</p> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-start text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="py-2 pe-3">{t('coupons.campaigns.table.title')}</th>
                <th className="py-2 pe-3">{t('coupons.campaigns.table.rule')}</th>
                <th className="py-2 pe-3">{t('coupons.campaigns.table.reward')}</th>
                <th className="py-2 pe-3">{t('coupons.campaigns.table.issued')}</th>
                <th className="py-2 pe-3">{t('coupons.campaigns.table.status')}</th>
                <th className="py-2 pe-3">{t('coupons.campaigns.table.created')}</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {!loading && campaigns.length === 0 ? <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">{t('coupons.campaigns.emptyStates.noCampaigns')}</td>
                </tr> : null}
              {campaigns.map(row => <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 pe-3 font-semibold text-slate-900 dark:text-slate-100">{row.title}</td>
                  <td className="py-2 pe-3 text-slate-600 dark:text-slate-300">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {row.required_purchase_count}{t('coupons.labels.ordersGreaterEqual')}{formatPrice(row.minimum_order_amount)}
                    </div>
                    {row.description ? <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400" title={row.description}>
                        {row.description}
                      </div> : null}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {getCategoryNames(row.eligible_categories).slice(0, 3).map((catName, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 rounded-full text-xs font-medium">
                          {catName}
                        </span>
                      ))}
                      {getCategoryNames(row.eligible_categories).length > 3 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          +{getCategoryNames(row.eligible_categories).length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pe-3 text-slate-600 dark:text-slate-300">{row.reward_percentage}%</td>
                  <td className="py-2 pe-3 text-slate-600 dark:text-slate-300">{row.coupons_count ?? 0}{t('coupons.labels.redeemedSlash')}{row.redeemed_coupons_count ?? 0}</td>
                  <td className="py-2 pe-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      {row.is_active ? t('coupons.campaigns.statusLabels.active') : t('coupons.campaigns.statusLabels.paused')}
                    </span>
                  </td>
                  <td className="py-2 pe-3 text-slate-600 dark:text-slate-300">
                    {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                  </td>
                  <td className="py-2 text-end">
                    <button type="button" className="me-2 rounded-lg p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => onToggle(row.id)} title={t('coupons.campaigns.buttons.toggle')}>
                      {row.is_active ? <ToggleRight size={16} className="text-blue-600 dark:text-blue-400" /> : <ToggleLeft size={16} />}
                    </button>
                    <button type="button" className="me-2 rounded-lg p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setModal({
                  mode: 'edit',
                  campaign: row
                })}>
                      <Pencil size={18} />
                    </button>
                    <button type="button" className="rounded-lg p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:bg-rose-950/40" onClick={() => onDelete(row.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('coupons.issuedCoupons.title')}</h2>
          {['active', 'redeemed', 'expired'].map(s => <button key={s} type="button" onClick={() => {
          setIssuedStatus(s);
          setIssuedPage(1);
        }} className={`rounded-full px-3 py-1 text-xs font-semibold ${issuedStatus === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
              {t(`coupons.issuedCoupons.tabs.${s}`)}
            </button>)}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-start text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="py-2 pe-3">{t('coupons.issuedCoupons.table.code')}</th>
                <th className="py-2 pe-3">{t('coupons.issuedCoupons.table.customer')}</th>
                <th className="py-2 pe-3">{t('coupons.issuedCoupons.table.campaign')}</th>
                <th className="py-2 pe-3">{t('coupons.issuedCoupons.table.percentage')}</th>
                <th className="py-2 pe-3">{t('coupons.issuedCoupons.table.validUntil')}</th>
                <th className="py-2">{t('coupons.issuedCoupons.table.status')}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && issued.length === 0 ? <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">{t('coupons.issuedCoupons.emptyStates.noCoupons')}</td>
                </tr> : null}
              {issued.map(row => <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 pe-3 font-mono text-xs">{row.code}</td>
                  <td className="py-2 pe-3">{row.user?.username || row.user?.email || '—'}</td>
                  <td className="py-2 pe-3">{row.campaign?.title || '—'}</td>
                  <td className="py-2 pe-3">{row.discount_percentage}%</td>
                  <td className="py-2 pe-3">{row.valid_until ? new Date(row.valid_until).toLocaleDateString() : '—'}</td>
                <td className="py-2">{row.is_used ? t('coupons.issuedCoupons.statusLabels.redeemed') : new Date(row.valid_until) <= new Date() ? t('coupons.issuedCoupons.statusLabels.expired') : t('coupons.issuedCoupons.statusLabels.active')}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      {modal ? <CampaignModal mode={modal.mode} campaign={modal.campaign} onClose={() => setModal(null)} onSaved={load} /> : null}
    </div>;
}