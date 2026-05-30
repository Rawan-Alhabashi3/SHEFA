import { useTranslation } from "react-i18next";
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/common/SectionTitle';
import Container from '../../components/common/Container';
import MedicineGrid from '../../components/medicines/MedicineGrid';
import useAppStore from '../../context/useAppStore';
import { getFavorites } from '../../services/favoritesService';
function FavoritesPage() {
  const {
    t
  } = useTranslation("common");
  const [loading, setLoading] = useState(true);
  const favorites = useAppStore(s => s.favorites);
  const setFavorites = useAppStore(s => s.setFavorites);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getFavorites().then(res => {
      if (!mounted) return;
      const payload = res?.data || res;
      const items = Array.isArray(payload?.data?.items) ? payload.data.items : Array.isArray(payload?.items) ? payload.items : [];
      setFavorites(items);
    }).catch(() => {
      if (!mounted) return;
      setFavorites([]);
    }).finally(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [setFavorites]);
  return <Container className="py-10">
      <SectionTitle title="Favorites" subtitle="Your saved medicines list" />
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        <Heart size={16} className="text-rose-500" />
        {favorites.length}{t("saved")}{favorites.length === 1 ? 'item' : t("items")}
      </div>

      {loading ? <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-sm text-slate-600 dark:text-slate-300">Loading favorites...</div> : favorites.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500">
            <Heart size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("No favorites yet")}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("Save medicines you want to revisit quickly from the marketplace.")}</p>
          <Link to="/medicines" className="mt-5 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Browse Medicines
          </Link>
        </div> : <MedicineGrid medicines={favorites} />}
    </Container>;
}
export default FavoritesPage;