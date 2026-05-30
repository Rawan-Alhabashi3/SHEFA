import { useTranslation } from "react-i18next";
import { Clock3, Package, Percent, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import PharmacyBadge from './PharmacyBadge';
import Button from '../common/Button';
import { FALLBACK_PHARMACY_IMAGE, resolveImageUrl, withFallback } from '../../utils/image';
function PharmacyCard({
  pharmacy
}) {
  const {
    t
  } = useTranslation("pharmacy");
  return <article className="card-lift overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20">
      <img src={resolveImageUrl(pharmacy.logo || pharmacy.image) || FALLBACK_PHARMACY_IMAGE} alt={pharmacy.pharmacy_name || pharmacy.name} className="h-36 w-full object-cover" onError={event => withFallback(event, FALLBACK_PHARMACY_IMAGE)} />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="truncate font-semibold">{pharmacy.pharmacy_name || pharmacy.name}</h3>
          <PharmacyBadge status={pharmacy.status || t('cards.status.open')} />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{[pharmacy.governorate, pharmacy.area].filter(Boolean).join(' • ')}</p>
        {pharmacy.address ? <p className="mt-1 line-clamp-1 text-xs text-slate-400 dark:text-slate-500">{pharmacy.address}</p> : null}
        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {Number(pharmacy.reviews_avg_rate ?? pharmacy.rating ?? 0).toFixed(1)}
          </span>
          <span className="flex min-w-0 items-center gap-1">
            <Clock3 size={14} className="shrink-0" />
            <span className="truncate">{pharmacy.working_hours || t('details.info.workingHours')}</span>
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Package size={12} />
            {Number(pharmacy.medicines_count || 0)} {t('cards.medicines')}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200">
            <Percent size={12} />
            {Number(pharmacy.active_campaigns_count || 0)} {t('cards.rewardCampaigns')}</span>
        </div>
        <Link to={`/pharmacies/${pharmacy.id}`}>
          <Button className="mt-4 w-full">{t('cards.viewPharmacy')}</Button>
        </Link>
      </div>
    </article>;
}
export default PharmacyCard;