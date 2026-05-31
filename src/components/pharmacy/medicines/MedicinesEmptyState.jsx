import { useTranslation } from 'react-i18next';

function MedicinesEmptyState({ isFiltered }) {
  const { t } = useTranslation('pharmacy');

  const message = isFiltered
    ? t('medicinesPage.emptyStates.noFilteredResults')
    : t('medicinesPage.emptyStates.noMedicines');

  return (
    <tr>
      <td className="py-8 text-center text-slate-500 dark:text-slate-400" colSpan={6}>
        {message}
      </td>
    </tr>
  );
}

export default MedicinesEmptyState;
