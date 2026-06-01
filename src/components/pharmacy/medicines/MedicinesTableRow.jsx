import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FALLBACK_MEDICINE_IMAGE, resolveImageUrl, withFallback } from '../../../utils/image';
import { getCategoryName } from '../../../utils/category';
import { formatPrice } from '../../../utils/format';
import MedicineStockBadge from './MedicineStockBadge';
import PrescriptionBadge from './PrescriptionBadge';

function MedicinesTableRow({ medicine, onEdit, onDelete }) {
  const { t, i18n } = useTranslation('pharmacy');

  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <img
              src={resolveImageUrl(medicine.image) || FALLBACK_MEDICINE_IMAGE}
              onError={withFallback(FALLBACK_MEDICINE_IMAGE)}
              alt={medicine.name}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{medicine.name}</p>
            {medicine.scientific_name ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{medicine.scientific_name}</p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="py-4 text-slate-600 dark:text-slate-300">
        {getCategoryName(medicine.category, i18n.resolvedLanguage || i18n.language)}
      </td>
      <td className="py-4 text-slate-600 dark:text-slate-300">{formatPrice(medicine.price || 0)}</td>
      <td className="py-4">
        <MedicineStockBadge quantity={medicine.quantity_available} />
      </td>
      <td className="py-4">
        <PrescriptionBadge requiresPrescription={medicine.requires_prescription} />
      </td>
      <td className="py-4">
        <div className="flex justify-end gap-2 whitespace-nowrap">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            onClick={() => onEdit(medicine)}
          >
            <Pencil size={15} /> <span className="hidden sm:inline">{t('medicinesPage.buttons.edit')}</span>
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 hover:text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-rose-700/70 dark:bg-slate-900 dark:text-rose-200 dark:hover:bg-rose-950/50 dark:hover:text-rose-100"
            onClick={() => onDelete(medicine.id)}
          >
            <Trash2 size={15} /> <span className="hidden sm:inline">{t('medicinesPage.buttons.delete')}</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default MedicinesTableRow;
