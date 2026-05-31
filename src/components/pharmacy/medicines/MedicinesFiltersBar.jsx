import { useTranslation } from 'react-i18next';
import { getCategoryName } from '../../../utils/category';
import Button from '../../common/Button';

function MedicinesFiltersBar({ search, category, categoryOptions, onSearchChange, onCategoryChange, onApply }) {
  const { t, i18n } = useTranslation('pharmacy');

  return (
    <div className="mb-4 grid gap-3 md:grid-cols-3">
      <input
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
        placeholder={t('medicinesPage.filters.searchPlaceholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">{t('medicinesPage.filters.allCategories')}</option>
        {categoryOptions.map((item) => (
          <option key={item.id} value={item.slug}>
            {getCategoryName(item, i18n.resolvedLanguage || i18n.language)}
          </option>
        ))}
      </select>
      <Button variant="secondary" onClick={onApply}>
        {t('medicinesPage.filters.apply')}
      </Button>
    </div>
  );
}

export default MedicinesFiltersBar;
