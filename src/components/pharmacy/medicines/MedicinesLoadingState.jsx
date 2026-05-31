import { useTranslation } from 'react-i18next';

function MedicinesLoadingState() {
  const { t } = useTranslation('common');

  return (
    <tr>
      <td className="py-8 text-center text-slate-500 dark:text-slate-400" colSpan={6}>
        {t('loading')}
      </td>
    </tr>
  );
}

export default MedicinesLoadingState;
