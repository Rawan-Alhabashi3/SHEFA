import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { ColorPicker, COLOR_PALETTE } from '../common/ColorPicker'
import { IconPicker } from '../common/IconPicker'

function CategoryModal({ isOpen, onClose, onSubmit, category = null, existingCategories = [] }) {
  const { t } = useTranslation('admin')
  const isEdit = !!category

  const [form, setForm] = useState({
    slug: category?.slug || '',
    name_en: category?.name_en || '',
    name_ar: category?.name_ar || '',
    icon: category?.icon || 'pill',
    color: category?.color || '#3b82f6',
    description: category?.description || '',
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active !== undefined ? category.is_active : true,
  })

  const [errors, setErrors] = useState({})

  const usedColors = existingCategories
    .filter(cat => cat.id !== category?.id)
    .map(cat => cat.color)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!form.slug.trim()) newErrors.slug = t('categories.validation.slugRequired')
    if (!form.name_en.trim()) newErrors.name_en = t('categories.validation.nameEnRequired')
    if (!form.name_ar.trim()) newErrors.name_ar = t('categories.validation.nameArRequired')
    if (!form.icon.trim()) newErrors.icon = t('categories.validation.iconRequired')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit(form)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? t('categories.editTitle') : t('categories.createTitle')} size="large" bodyClassName="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('categories.fields.slug')}
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.slug
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-700 dark:focus:border-rose-500 dark:focus:ring-rose-950'
                  : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950'
              }`}
              placeholder={t('categories.fields.slugPlaceholder')}
            />
            {errors.slug && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.slug}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('categories.fields.sortOrder')}
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('categories.fields.nameEn')}
            </label>
            <input
              type="text"
              value={form.name_en}
              onChange={(e) => handleChange('name_en', e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.name_en
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-700 dark:focus:border-rose-500 dark:focus:ring-rose-950'
                  : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950'
              }`}
              placeholder={t('categories.fields.nameEnPlaceholder')}
            />
            {errors.name_en && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.name_en}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('categories.fields.nameAr')}
            </label>
            <input
              type="text"
              value={form.name_ar}
              onChange={(e) => handleChange('name_ar', e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.name_ar
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-700 dark:focus:border-rose-500 dark:focus:ring-rose-950'
                  : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950'
              }`}
              placeholder={t('categories.fields.nameArPlaceholder')}
            />
            {errors.name_ar && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.name_ar}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {t('categories.fields.icon')}
          </label>
          <IconPicker
            value={form.icon}
            onChange={(value) => handleChange('icon', value)}
          />
          {errors.icon && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.icon}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {t('categories.fields.color')}
          </label>
          <ColorPicker
            value={form.color}
            onChange={(value) => handleChange('color', value)}
            usedColors={usedColors}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {t('categories.fields.description')}
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950 resize-none"
            placeholder={t('categories.fields.descriptionPlaceholder')}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900"
          />
          <label htmlFor="is_active" className="text-sm text-slate-700 dark:text-slate-200">
            {t('categories.fields.isActive')}
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="!rounded-xl px-4 py-2"
            variant="secondary"
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="!rounded-xl px-4 py-2">
            {isEdit ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CategoryModal
