import { useTranslation } from 'react-i18next';
import MedicinesTableRow from './MedicinesTableRow';
import MedicinesEmptyState from './MedicinesEmptyState';
import MedicinesLoadingState from './MedicinesLoadingState';

function MedicinesTable({ medicines, loading, isFiltered, onEdit, onDelete }) {
  const { t } = useTranslation('pharmacy');

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <th className="py-3 text-start font-semibold">{t('medicinesPage.table.medicine')}</th>
            <th className="py-3 text-start font-semibold">{t('medicinesPage.table.category')}</th>
            <th className="py-3 text-start font-semibold">{t('medicinesPage.table.price')}</th>
            <th className="py-3 text-start font-semibold">{t('medicinesPage.table.stock')}</th>
            <th className="py-3 text-start font-semibold">{t('medicinesPage.table.prescription')}</th>
            <th className="py-3 text-end font-semibold">{t('medicinesPage.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <MedicinesLoadingState /> : null}
          {!loading && medicines.length === 0 ? <MedicinesEmptyState isFiltered={isFiltered} /> : null}
          {!loading &&
            medicines.map((medicine) => (
              <MedicinesTableRow
                key={medicine.id}
                medicine={medicine}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicinesTable;
