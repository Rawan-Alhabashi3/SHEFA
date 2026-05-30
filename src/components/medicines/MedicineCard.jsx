import { useTranslation } from "react-i18next";
import { Heart, Lock, MapPin, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useAppStore from '../../context/useAppStore';
import { addFavorite, removeFavorite } from '../../services/favoritesService';
import { formatPrice } from '../../utils/format';
import { FALLBACK_MEDICINE_IMAGE, resolveImageUrl, withFallback } from '../../utils/image';
import Button from '../common/Button';
import Modal from '../common/Modal';
function MedicineCard({
  medicine
}) {
  const {
    t
  } = useTranslation("medicines");
  const {
    isAuthenticated,
    role
  } = useAuth();
  const addToCart = useAppStore(s => s.addToCart);
  const favorites = useAppStore(s => s.favorites);
  const addFavoriteLocal = useAppStore(s => s.addFavoriteLocal);
  const removeFavoriteLocal = useAppStore(s => s.removeFavoriteLocal);
  const cart = useAppStore(s => s.cart);
  const pushCartEvent = useAppStore(s => s.pushCartEvent);
  const lastCartEvent = useAppStore(s => s.lastCartEvent);
  const inCartQty = useAppStore(s => s.cart.find(i => i.id === medicine?.id)?.quantity || 0);
  const [justAdded, setJustAdded] = useState(false);
  const [showAreaConfirm, setShowAreaConfirm] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const isCustomer = isAuthenticated && role === 'citizen';
  const isFavorited = favorites.some(f => f.id === medicine?.id);
  const stock = Number(medicine?.quantity_available);
  const inStock = !Number.isFinite(stock) || stock > 0;
  const canAddMore = !Number.isFinite(stock) || inCartQty < stock;
  const medicineGovernorate = medicine?.pharmacy?.governorate || null;
  const medicineArea = medicine?.pharmacy?.area || null;
  const isPrescriptionOnly = Boolean(medicine?.requires_prescription);
  const existingGovernorates = new Set(cart.map(i => i.medicine?.pharmacy?.governorate).filter(Boolean));
  const existingAreas = new Set(cart.map(i => i.medicine?.pharmacy?.area).filter(Boolean));
  const wouldCrossGovernorate = existingGovernorates.size > 0 && medicineGovernorate && !existingGovernorates.has(medicineGovernorate);
  const wouldCreateNewAreaGroup = existingAreas.size > 0 && medicineArea && !existingAreas.has(medicineArea) && !wouldCrossGovernorate;
  const unitPrice = Number(medicine?.price) || 0;
  const imageSrc = resolveImageUrl(medicine?.image) || FALLBACK_MEDICINE_IMAGE;
  useEffect(() => {
    if (lastCartEvent?.id !== medicine?.id) return;
    if (lastCartEvent?.type !== 'add' && lastCartEvent?.type !== 'increment') return;
    setJustAdded(true);
    const timer = window.setTimeout(() => setJustAdded(false), 1200);
    return () => window.clearTimeout(timer);
  }, [lastCartEvent, medicine?.id]);
  const handleFavoriteToggle = async () => {
    if (!isCustomer || !medicine?.id || isFavoriteLoading) return;
    const medicineId = medicine.id;
    const wasFavorited = isFavorited;
    setIsFavoriteLoading(true);
    if (wasFavorited) removeFavoriteLocal(medicineId);else addFavoriteLocal(medicine);
    try {
      if (wasFavorited) {
        await removeFavorite(medicineId);
        pushCartEvent({
          type: 'favoriteRemoved',
          id: medicineId
        });
      } else {
        await addFavorite(medicineId);
        pushCartEvent({
          type: 'favoriteAdded',
          id: medicineId
        });
      }
    } catch {
      if (wasFavorited) addFavoriteLocal(medicine);else removeFavoriteLocal(medicineId);
      pushCartEvent({
        type: 'favoriteSyncFailed',
        id: medicineId
      });
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  const addMedicineToCart = () => {
    if (wouldCrossGovernorate) {
      pushCartEvent({
        type: 'blockedGovernorate',
        medicineId: medicine?.id
      });
      return;
    }
    if (wouldCreateNewAreaGroup) {
      setShowAreaConfirm(true);
      return;
    }
    addToCart(medicine, 1);
  };
  return <article className="card-lift overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20">
      <div className="relative">
        <img src={imageSrc} alt={medicine?.name || t("Medicine")} className="h-44 w-full object-cover transition duration-300 hover:scale-105" onError={event => withFallback(event, FALLBACK_MEDICINE_IMAGE)} />
        {isCustomer ? <button type="button" className={`absolute end-3 top-3 rounded-full bg-white dark:bg-slate-900 p-2 transition ${isFavoriteLoading ? 'opacity-60' : 'hover:scale-105'}`} onClick={handleFavoriteToggle} disabled={isFavoriteLoading} aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart size={16} className={isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'} />
          </button> : null}
      </div>

      <div className="p-4">
        <h3 className="font-semibold">{medicine?.name || 'Untitled medicine'}</h3>
        {medicine?.category_label ? <p className="mt-1 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            {medicine.category_label}
          </p> : null}
        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{medicine?.description || '-'}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {medicine?.pharmacy?.pharmacy_name || 'Pharmacy unavailable'}
          {medicine?.pharmacy?.governorate ? ` • ${medicine.pharmacy.governorate}` : ''}
          {medicine?.pharmacy?.area ? ` • ${medicine.pharmacy.area}` : ''}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-300">{formatPrice(unitPrice)}</p>
          </div>
          {medicine?.rating != null ? <span className="flex items-center gap-1 text-sm">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {medicine.rating}
            </span> : null}
        </div>

        {isPrescriptionOnly ? <div className="mt-3 rounded-2xl border border-amber-200 dark:border-amber-700/70 bg-amber-50 dark:bg-amber-950/40 px-3 py-2">
            <div className="flex items-center gap-2 text-amber-800">
              <Lock size={14} />
              <p className="text-xs font-bold uppercase tracking-wide">{t("Prescription Required")}</p>
            </div>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-200">Available in pharmacy only. Requires physical prescription.</p>
          </div> : null}

        {!inStock ? <p className="mt-3 text-xs font-semibold text-rose-600">Out of stock</p> : Number.isFinite(stock) && stock <= 5 ? <p className="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-200">{t("Low stock:")}{stock}{t("left")}</p> : <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-200">In stock</p>}

        {isPrescriptionOnly ? <Link to={medicine?.pharmacy_id ? `/pharmacies/${medicine.pharmacy_id}` : '/pharmacies'} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-amber-200 dark:border-amber-700/70 bg-amber-50 dark:bg-amber-950/40 px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100">
            <MapPin size={15} />{t("View Pharmacy")}</Link> : <Button className="mt-2 w-full" disabled={!inStock || !canAddMore} onClick={addMedicineToCart}>
            {!inStock ? 'Out of Stock' : !canAddMore ? 'Max quantity reached' : justAdded ? 'Added' : 'Add to Cart'}
          </Button>}
      </div>

      {showAreaConfirm ? <Modal title="Different area delivery" onClose={() => setShowAreaConfirm(false)}>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t("This medicine belongs to a pharmacy in a different area. Adding it will create a separate delivery group.")}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowAreaConfirm(false)} className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">
              Cancel
            </button>
            <Button type="button" onClick={() => {
          addToCart(medicine, 1);
          setShowAreaConfirm(false);
          pushCartEvent({
            type: 'areaSeparated',
            medicineId: medicine?.id
          });
        }}>
              Continue
            </Button>
          </div>
        </Modal> : null}
    </article>;
}
export default MedicineCard;