import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../common/Button';

function MedicinesPageHeader({ onAdd }) {
  const { t } = useTranslation('pharmacy');

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('medicinesPage.header.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('medicinesPage.header.description')}
        </p>
      </div>
      <Button onClick={onAdd}>
        <span className="inline-flex items-center gap-2">
          <Plus size={16} /> {t('medicinesPage.buttons.add')}
        </span>
      </Button>
    </div>
  );
}

export default MedicinesPageHeader;
