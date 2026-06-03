import { Download, FileDown, Plus, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../common/Button';

function MedicinesPageHeader({ onAdd, onDownloadTemplate, onBulkImport }) {
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
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onDownloadTemplate}>
          <span className="inline-flex items-center gap-2">
            <Download size={16} /> Download Template
          </span>
        </Button>
        <Button variant="secondary" onClick={onBulkImport}>
          <span className="inline-flex items-center gap-2">
            <Upload size={16} /> Import Medicines
          </span>
        </Button>
        <Button onClick={onAdd}>
          <span className="inline-flex items-center gap-2">
            <Plus size={16} /> {t('medicinesPage.buttons.add')}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default MedicinesPageHeader;
