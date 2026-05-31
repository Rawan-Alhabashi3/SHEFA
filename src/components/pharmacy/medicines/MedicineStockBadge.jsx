import { useTranslation } from 'react-i18next';

function MedicineStockBadge({ quantity }) {
  const { t } = useTranslation('pharmacy');

  const getStockStatus = () => {
    if (quantity === 0) {
      return {
        label: t('medicinesPage.statuses.outOfStock'),
        className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200',
      };
    }
    if (quantity <= 10) {
      return {
        label: t('medicinesPage.statuses.lowStock'),
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200',
      };
    }
    return {
      label: t('medicinesPage.statuses.inStock'),
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200',
    };
  };

  const { label, className } = getStockStatus();

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {quantity}
    </span>
  );
}

export default MedicineStockBadge;
