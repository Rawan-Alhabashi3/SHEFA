import { CreditCard, MapPin, PackageCheck, ShieldCheck, Truck, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import EmptyState from '../../components/common/EmptyState';
import { GOVERNORATE_AREAS, GOVERNORATES } from '../../constants/locations';
import { useAuth } from '../../context/AuthContext';
import useAppStore from '../../context/useAppStore';
import { marketplaceCheckout } from '../../services/marketplaceCheckoutService';
import { formatPrice } from '../../utils/format';
const inputClass = 'w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950';
function getFriendlyError(err, tErrors) {
  const message = err?.response?.data?.message;
  if (typeof message === 'string') return message;
  if (message && typeof message === 'object') {
    const first = Object.values(message).flat()[0];
    if (first) return String(first);
  }
  return tErrors('checkoutFailed');
}
function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
function CheckoutPage() {
  const {
    t
  } = useTranslation('checkout');
  const {
    t: ta
  } = useTranslation('auth');
  const {
    t: te
  } = useTranslation('errors');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    role,
    user,
    refreshProfile
  } = useAuth();
  const cart = useAppStore(s => s.cart);
  const cartSummary = useAppStore(s => s.cartSummary);
  const clearCart = useAppStore(s => s.clearCart);
  const purgeRestrictedCartItems = useAppStore(s => s.purgeRestrictedCartItems);
  const orderableCart = cart.filter(item => !item?.medicine?.requires_prescription);
  const summary = cartSummary();
  const paymentOptions = useMemo(() => [{
    value: 'cash',
    title: t('paymentCashTitle'),
    description: t('paymentCashDescription'),
    icon: WalletCards
  }, {
    value: 'electronic',
    title: t('paymentElectronicTitle'),
    description: t('paymentElectronicDescription'),
    icon: CreditCard
  }], [t]);
  const savedLocation = useMemo(() => {
    try {
      const raw = localStorage.getItem('shifa_location');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);
  const [form, setForm] = useState(() => ({
    customer_name: user?.username || user?.name || '',
    phone_number: user?.phone || '',
    governorate: user?.governorate || savedLocation?.governorate || '',
    area: user?.area || savedLocation?.area || '',
    address: user?.address || '',
    notes: '',
    payment_method: 'cash',
    coupon_code: ''
  }));
  const [card, setCard] = useState({
    card_holder_name: '',
    card_number: '',
    expiry_date: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    purgeRestrictedCartItems();
  }, [purgeRestrictedCartItems]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: {
          from: location.pathname
        }
      });
      return;
    }
    refreshProfile().catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, location.pathname, navigate]);
  useEffect(() => {
    if (!user) return;
    setForm(prev => ({
      ...prev,
      customer_name: prev.customer_name || user.username || user.name || '',
      phone_number: prev.phone_number || user.phone || '',
      governorate: prev.governorate || user.governorate || '',
      area: prev.area || user.area || '',
      address: prev.address || user.address || ''
    }));
  }, [user]);
  const groupedCheckout = useMemo(() => {
    const governorates = new Set();
    const areaGroups = new Map();
    const pharmacyIds = new Set();
    const ug = t('unknownGovernorate');
    const ua = t('unknownArea');
    for (const item of orderableCart) {
      const pharmacy = item.medicine?.pharmacy || {};
      const governorate = pharmacy.governorate || ug;
      const area = pharmacy.area || ua;
      const pharmacyId = pharmacy.id ?? item.medicine?.pharmacy_id ?? 'unknown';
      const areaKey = `${governorate}|${area}`;
      const pharmacyKey = `${areaKey}|${pharmacyId}`;
      governorates.add(governorate);
      pharmacyIds.add(pharmacyId);
      if (!areaGroups.has(areaKey)) {
        areaGroups.set(areaKey, {
          governorate,
          area,
          pharmacies: new Map()
        });
      }
      const group = areaGroups.get(areaKey);
      if (!group.pharmacies.has(pharmacyKey)) {
        group.pharmacies.set(pharmacyKey, {
          id: pharmacyId,
          name: pharmacy.pharmacy_name || t('pharmacyNumber', {
            id: pharmacyId
          }),
          items: [],
          subtotal: 0
        });
      }
      const pharmacyGroup = group.pharmacies.get(pharmacyKey);
      const price = Number(item.medicine?.price) || 0;
      const lineTotal = price * (Number(item.quantity) || 0);
      const unitPrice = price;
      pharmacyGroup.subtotal += lineTotal;
      pharmacyGroup.items.push({
        ...item,
        unitFinal: unitPrice,
        lineTotal
      });
    }
    return {
      governorates: Array.from(governorates),
      areas: Array.from(areaGroups.values()).map(areaGroup => ({
        ...areaGroup,
        pharmacies: Array.from(areaGroup.pharmacies.values())
      })),
      pharmacyCount: pharmacyIds.size
    };
  }, [orderableCart, t]);
  const availableAreas = form.governorate ? GOVERNORATE_AREAS[form.governorate] || [] : [];
  const canCheckout = orderableCart.length > 0;
  const hasMultipleAreaGroups = groupedCheckout.areas.length > 1;
  const orderSummaryLine = useMemo(() => {
    const pc = groupedCheckout.pharmacyCount;
    const gr = groupedCheckout.areas.length;
    return t('orderSummaryCounts', {
      pharmacies: pc,
      groups: gr,
      pharmacyWord: pc === 1 ? t('wordPharmacy') : t('wordPharmacies'),
      groupWord: gr === 1 ? t('wordDeliveryGroup') : t('wordDeliveryGroups')
    });
  }, [groupedCheckout.pharmacyCount, groupedCheckout.areas.length, t]);
  const validate = () => {
    if (!canCheckout) return 'cartEmpty';
    if (role && role !== 'citizen') return 'onlyCustomer';
    if (!form.customer_name.trim()) return 'fullName';
    if (!form.phone_number.trim()) return 'phone';
    if (!form.governorate.trim()) return 'governorate';
    if (!form.area.trim()) return 'area';
    if (!form.address.trim()) return 'address';
    if (!form.payment_method) return 'paymentMethod';
    if (groupedCheckout.governorates.length > 1) return 'multiGovernorate';
    if (groupedCheckout.governorates[0] && groupedCheckout.governorates[0] !== form.governorate) {
      return 'governorateMismatch';
    }
    if (form.payment_method === 'electronic') {
      if (!card.card_holder_name.trim()) return 'cardHolder';
      if (card.card_number.replace(/\D/g, '').length < 13) return 'cardNumber';
      if (!card.expiry_date.trim()) return 'expiry';
      if (card.cvv.replace(/\D/g, '').length < 3) return 'cvv';
    }
    return '';
  };
  const onSubmit = async event => {
    event.preventDefault();
    setError('');
    const validationKey = validate();
    if (validationKey) {
      const msg = t(`validation.${validationKey}`);
      setError(msg);
      toast.warning(msg);
      return;
    }
    const items = orderableCart.map(item => ({
      medicine_id: item.id,
      desired_quantity: item.quantity
    }));
    const coupons = form.coupon_code.trim() && groupedCheckout.pharmacyCount === 1 ? {
      [groupedCheckout.areas[0]?.pharmacies[0]?.id]: form.coupon_code.trim()
    } : undefined;
    setLoading(true);
    try {
      const response = await marketplaceCheckout({
        customer_name: form.customer_name.trim(),
        phone_number: form.phone_number.trim(),
        governorate: form.governorate.trim(),
        area: form.area.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || undefined,
        payment_method: form.payment_method,
        payment_details: form.payment_method === 'electronic' ? {
          card_holder_name: card.card_holder_name.trim(),
          card_number: card.card_number.replace(/\D/g, ''),
          expiry_date: card.expiry_date.trim(),
          cvv: card.cvv.replace(/\D/g, '')
        } : undefined,
        coupons,
        items
      });
      const payload = response?.data || response;
      clearCart();
      toast.success(form.payment_method === 'cash' ? t('toastSuccessCash') : t('toastSuccessCard'));
      navigate('/orders', {
        replace: true,
        state: {
          checkoutComplete: true,
          ordersCount: payload?.orders_count,
          shipmentsCount: payload?.shipments_count
        }
      });
    } catch (err) {
      const message = getFriendlyError(err, te);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  if (!canCheckout) {
    return <Container className="py-10">
        <EmptyState title={t('emptyCartTitle')} description={t('emptyCartDescription')} />
        <div className="mt-6">
          <Link to="/pharmacies" className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200">
            {t('browsePharmacies')}
          </Link>
        </div>
      </Container>;
  }
  return <Container className="py-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">{t('secureEyebrow')}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{t('title')}</h1>
        </div>
        <Link to="/cart" className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200">
          {t('backToCart')}
        </Link>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20 md:p-6">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-300">
                <MapPin size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('customerSectionTitle')}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('customerSectionHint')}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('fullName')}</label>
                <input className={inputClass} value={form.customer_name} onChange={e => setForm(p => ({
                ...p,
                customer_name: e.target.value
              }))} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('phoneNumber')}</label>
                <input className={inputClass} value={form.phone_number} onChange={e => setForm(p => ({
                ...p,
                phone_number: e.target.value
              }))} placeholder={t('phonePlaceholder')} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('governorate')}</label>
                <select className={inputClass} value={form.governorate} onChange={e => setForm(p => ({
                ...p,
                governorate: e.target.value,
                area: ''
              }))}>
                  <option value="">{t('selectGovernorate')}</option>
                  {GOVERNORATES.map(gov => <option key={gov} value={gov}>
                      {ta(`cities.${gov}`)}
                    </option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('area')}</label>
                {availableAreas.length > 0 ? <select className={inputClass} value={form.area} onChange={e => setForm(p => ({
                ...p,
                area: e.target.value
              }))}>
                    <option value="">{t('selectArea')}</option>
                    {availableAreas.map(area => <option key={area} value={area}>
                        {area}
                      </option>)}
                  </select> : <input className={inputClass} value={form.area} onChange={e => setForm(p => ({
                ...p,
                area: e.target.value
              }))} placeholder={t('areaPlaceholder')} />}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('detailedAddress')}</label>
                <input className={inputClass} value={form.address} onChange={e => setForm(p => ({
                ...p,
                address: e.target.value
              }))} placeholder={t('addressPlaceholder')} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('notesOptional')}</label>
                <textarea className={`${inputClass} min-h-24 resize-none`} value={form.notes} onChange={e => setForm(p => ({
                ...p,
                notes: e.target.value
              }))} placeholder={t('notesPlaceholder')} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20 md:p-6">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-300">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('paymentMethod')}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('paymentMethodHint')}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {paymentOptions.map(option => {
              const Icon = option.icon;
              const selected = form.payment_method === option.value;
              return <button key={option.value} type="button" onClick={() => setForm(p => ({
                ...p,
                payment_method: option.value
              }))} className={`rounded-2xl border p-4 text-start transition ${selected ? 'border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-sm dark:shadow-slate-950/20 ring-4 ring-blue-100 dark:ring-blue-950' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-200 dark:border-blue-700/70'}`}>
                    <span className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-2 text-blue-600 dark:text-blue-300 shadow-sm dark:shadow-slate-950/20">
                      <Icon size={19} />
                    </span>
                    <p className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">{option.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{option.description}</p>
                  </button>;
            })}
            </div>

            {form.payment_method === 'electronic' ? <div className="mt-5 rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-slate-50 dark:bg-slate-950 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('cardHolderName')}</label>
                    <input className={inputClass} value={card.card_holder_name} onChange={e => setCard(p => ({
                  ...p,
                  card_holder_name: e.target.value
                }))} placeholder={t('cardHolderPlaceholder')} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('cardNumber')}</label>
                    <input className={inputClass} inputMode="numeric" value={card.card_number} onChange={e => setCard(p => ({
                  ...p,
                  card_number: formatCardNumber(e.target.value)
                }))} placeholder={t('cardNumberPlaceholder')} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('expiryDate')}</label>
                    <input className={inputClass} inputMode="numeric" value={card.expiry_date} onChange={e => setCard(p => ({
                  ...p,
                  expiry_date: formatExpiry(e.target.value)
                }))} placeholder={t('expiryPlaceholder')} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('cvv')}</label>
                    <input className={inputClass} inputMode="numeric" value={card.cvv} onChange={e => setCard(p => ({
                  ...p,
                  cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                }))} placeholder={t('cvvPlaceholder')} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t('demoCardNote')}</p>
              </div> : <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-800">
                {t('cashPendingNote')}
              </div>}
          </section>
        </div>

        <aside className="h-fit space-y-4 xl:sticky xl:top-24">
          <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-300">
                <PackageCheck size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('orderSummary')}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{orderSummaryLine}</p>
              </div>
            </div>

            {hasMultipleAreaGroups ? <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-sm text-amber-800">
                {t('multiAreaWarning')}
              </div> : <div className="mt-4 rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 text-sm text-blue-800 dark:text-blue-100">
                {t('sameAreaInfo')}
              </div>}

            <div className="mt-4 space-y-4">
              {groupedCheckout.areas.map(areaGroup => <div key={`${areaGroup.governorate}-${areaGroup.area}`} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <Truck size={16} className="text-blue-600 dark:text-blue-300" />
                    {areaGroup.governorate} / {areaGroup.area}
                  </div>
                  <div className="mt-3 space-y-3">
                    {areaGroup.pharmacies.map(pharmacy => <div key={pharmacy.id} className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{pharmacy.name}</p>
                          <p className="text-sm font-bold text-blue-700 dark:text-blue-200">{formatPrice(pharmacy.subtotal)}</p>
                        </div>
                        <div className="mt-2 space-y-1">
                          {pharmacy.items.map(item => <div key={item.id} className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <span className="line-clamp-1">{item.medicine?.name || t('medicineFallback')}{t("x")}{item.quantity}</span>
                              <span>{formatPrice(item.lineTotal)}</span>
                            </div>)}
                        </div>
                      </div>)}
                  </div>
                </div>)}
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('couponLabel')}</label>
              <input className={inputClass} value={form.coupon_code} onChange={e => setForm(p => ({
              ...p,
              coupon_code: e.target.value
            }))} placeholder={groupedCheckout.pharmacyCount === 1 ? t('couponPlaceholderSingle') : t('couponPlaceholderMulti')} disabled={groupedCheckout.pharmacyCount !== 1} />
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">{t('subtotal')}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPrice(summary.subtotal)}</span>
              </div>
              {summary.savings > 0 ? <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">{t('discounts')}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-200">- {formatPrice(summary.savings)}</span>
                </div> : null}
              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-slate-900 dark:text-slate-100">{t('finalTotal')}</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{formatPrice(summary.total)}</span>
              </div>
            </div>

            {error ? <p className="mt-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

            <Button type="submit" className="mt-5 w-full disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>
              {loading ? form.payment_method === 'electronic' ? t('processingPayment') : t('creatingOrder') : t('placeOrder')}
            </Button>
          </section>
        </aside>
      </form>
    </Container>;
}
export default CheckoutPage;