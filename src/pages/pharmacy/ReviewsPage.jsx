import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import { getPharmacyReviews } from '../../services/pharmacyService';
function PharmacyReviewsPage() {
  const {
    t
  } = useTranslation("pharmacy");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    setLoading(true);
    setError('');
    getPharmacyReviews().then(res => setReviews(res?.data || [])).catch(err => setError(err?.response?.data?.message || t('reviews.errors.failedToLoadReviews'))).finally(() => setLoading(false));
  }, []);

  return <section>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('reviews.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('reviews.description')}</p>
      </div>

      <Card className="p-5">
        {error ? <p className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}
        {loading ? <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.loading') || 'Loading...'}</p> : null}
        {!loading && reviews.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">{t('reviews.emptyStates.noReviewsYet')}</p> : null}
        <div className="space-y-3">
          {reviews.map(r => <div key={r.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{r.user?.username}</p>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">{r.rate || 0}/5</p>
              </div>
              {r.comment ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p> : <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">{t('reviews.labels.noCommentProvided')}</p>}
            </div>)}
        </div>
      </Card>
    </section>;
}
export default PharmacyReviewsPage;