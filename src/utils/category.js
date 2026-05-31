/**
 * Display DB-backed category names based on active UI language.
 * Do not use i18next enum mapping for medicine categories.
 */
export function getCategoryName(category, language) {
  if (!category) return '';

  const lang = String(language || '').toLowerCase();

  if (lang.startsWith('ar')) {
    return category.name_ar || category.name_en || category.name || '';
  }

  return category.name_en || category.name_ar || category.name || '';
}

export function normalizeCategoryFilterValue(category) {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.slug || String(category.id || '');
}
