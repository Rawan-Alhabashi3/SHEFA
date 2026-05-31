import { useTranslation } from 'react-i18next';

function PrescriptionBadge({ requiresPrescription }) {
  const { t } = useTranslation('pharmacy');

  if (requiresPrescription) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
        {t('medicinesPage.statuses.prescriptionRequired')}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      {t('medicinesPage.statuses.notRequired')}
    </span>
  );
}

export default PrescriptionBadge;
