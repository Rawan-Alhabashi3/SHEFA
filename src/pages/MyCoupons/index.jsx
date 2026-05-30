import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { Tag, History } from 'lucide-react';
import Card from '../../components/common/Card';
import SectionTitle from '../../components/common/SectionTitle';
import { getCouponHistory, getMyCoupons } from '../../services/couponService';
import { formatPrice } from '../../utils/format';
function CouponCard({
  row,
  expired
}) {
  const {
    t
  } = useTranslation("coupons");
  return <div className={`rounded-2xl border p-4 ${expired ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950' : 'border-emerald-200 dark:border-emerald-700/70 bg-emerald-50 dark:bg-emerald-950/40'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{row.pharmacy?.pharmacy_name || 'Pharmacy'}</p>
          <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">{row.code}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{row.campaign?.title || 'Reward coupon'} · {row.discount_percentage}{t("% off eligible cosmetics & care")}</p>
          {Array.isArray(row.eligible_categories) && row.eligible_categories.length ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t("Categories:")}{row.eligible_categories.join(', ')}</p> : null}
        </div>
        <div className="text-end text-sm text-slate-600 dark:text-slate-300">
          <p>{expired ? t("Expired") : `Expires ${new Date(row.valid_until).toLocaleDateString()}`}</p>
          {!expired && row.days_left != null ? <p className="text-xs text-slate-500 dark:text-slate-400">{row.days_left}{t("days left")}</p> : null}
        </div>
      </div>
    </div>;
}
export default function MyCouponsPage() {
  const {
    t
  } = useTranslation("coupons");
  const [active, setActive] = useState([]);
  const [expired, setExpired] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('active');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [c, h] = await Promise.all([getMyCoupons(), getCouponHistory()]);
        if (!mounted) return;
        const cData = c?.data?.data ?? c?.data ?? {};
        setActive(Array.isArray(cData?.active) ? cData.active : []);
        setExpired(Array.isArray(cData?.expired_unused) ? cData.expired_unused : []);
        const raw = h?.data?.data ?? h?.data ?? [];
        setHistory(Array.isArray(raw) ? raw : []);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  return <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <SectionTitle eyebrow="Rewards" title={t("My coupons")} />
      <p className="-mt-4 text-sm text-slate-600 dark:text-slate-300">{t("Pharmacy-issued cosmetics & care discounts. Medicines are never discounted with these codes.")}</p>

      <div className="flex gap-2">
        {[{
        id: 'active',
        label: 'Active',
        icon: Tag
      }, {
        id: 'expired',
        label: 'Expired',
        icon: Tag
      }, {
        id: 'history',
        label: 'History',
        icon: History
      }].map(({
        id,
        label,
        icon: Icon
      }) => <button key={id} type="button" onClick={() => setTab(id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${tab === id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700'}`}>
            <Icon size={16} /> {label}
          </button>)}
      </div>

      <Card className="p-6">
        {loading ? <p className="text-sm text-slate-500 dark:text-slate-400">Loading your coupons…</p> : null}
        {!loading && tab === 'active' ? active.length === 0 ? <p className="text-sm text-slate-600 dark:text-slate-300">{t("No active coupons. Shop cosmetics from participating pharmacies to earn rewards.")}</p> : <div className="space-y-3">{active.map(row => <CouponCard key={row.id} row={row} expired={false} />)}</div> : null}
        {!loading && tab === 'expired' ? expired.length === 0 ? <p className="text-sm text-slate-600 dark:text-slate-300">{t("No expired unused coupons.")}</p> : <div className="space-y-3">{expired.map(row => <CouponCard key={row.id} row={row} expired />)}</div> : null}
        {!loading && tab === 'history' ? history.length === 0 ? <p className="text-sm text-slate-600 dark:text-slate-300">{t("No redemption history yet.")}</p> : <div className="overflow-x-auto">
              <table className="min-w-full text-start text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-slate-500 dark:text-slate-400">
                    <th className="py-2 pe-3">Code</th>
                    <th className="py-2 pe-3">Pharmacy</th>
                    <th className="py-2 pe-3">{t("Order")}</th>
                    <th className="py-2">{t("Redeemed")}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(row => <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 pe-3 font-mono text-xs">{row.code}</td>
                      <td className="py-2 pe-3">{row.pharmacy?.pharmacy_name}</td>
                      <td className="py-2 pe-3">{row.order ? `#${row.order.id} · ${formatPrice(row.order.total_price)}` : '—'}</td>
                      <td className="py-2">{row.redeemed_at ? new Date(row.redeemed_at).toLocaleString() : '—'}</td>
                    </tr>)}
                </tbody>
              </table>
            </div> : null}
      </Card>
    </div>;
}