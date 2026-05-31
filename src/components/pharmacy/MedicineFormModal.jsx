import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { listCategories } from '../../services/categoryService'

const emptyForm = {
  name: '',
  scientific_name: '',
  price: '',
  category_id: '',
  manufacturer: '',
  dosage: '',
  quantity_available: '',
  expiration_date: '',
  requires_prescription: false,
  description: '',
  usage_instructions: '',
  image: null,
}

const formatDateValue = value => {
  if (!value) return ''
  return String(value).slice(0, 10)
}

const extractValidation = (error, t) => {
  const data = error?.response?.data
  const errors = data?.errors || (typeof data?.message === 'object' ? data.message : {})
  const first = Object.values(errors || {})?.[0]?.[0]
  return {
    summary: typeof data?.message === 'string' ? data.message : first || error?.message || t('medicines.modal.errors.unableToSave'),
    fields: errors || {},
  }
}

function FormSection({ title, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 ${className}`}>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h4>
      {children}
    </section>
  )
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>
      {children}
      {error}
    </div>
  )
}

function MedicineFormModal({ open, mode, initialValue, onClose, onSubmit }) {
  const { t, i18n } = useTranslation(['pharmacy', 'common'])
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!open) return

    listCategories({ activeOnly: true })
      .then(items => setCategories(Array.isArray(items) ? items : []))
      .catch(() => setCategories([]))
  }, [open])

  useEffect(() => {
    if (!open) return

    if (initialValue) {
      setForm({
        name: initialValue.name || '',
        scientific_name: initialValue.scientific_name || '',
        price: String(initialValue.price ?? ''),
        category_id: String(initialValue.category_id || initialValue.category?.id || ''),
        manufacturer: initialValue.manufacturer || '',
        dosage: initialValue.dosage || '',
        quantity_available: String(initialValue.quantity_available ?? ''),
        expiration_date: formatDateValue(initialValue.expiration_date),
        requires_prescription: Boolean(initialValue.requires_prescription),
        description: initialValue.description || '',
        usage_instructions: initialValue.usage_instructions || '',
        image: null,
      })
    } else {
      setForm(emptyForm)
    }

    setSaving(false)
    setError('')
    setFieldErrors({})
  }, [open, initialValue])

  const title = useMemo(() => (mode === 'edit' ? t('medicines.modal.editMedicine') : t('medicines.addMedicine')), [mode, t])
  const inputClass = name =>
    `h-10 w-full rounded-xl border bg-white dark:bg-slate-950 px-3 text-sm outline-none transition focus:border-blue-300 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 ${
      fieldErrors[name] ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40' : 'border-slate-200 dark:border-slate-700'
    }`
  const textareaClass = name =>
    `w-full rounded-xl border bg-white dark:bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-blue-300 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 ${
      fieldErrors[name] ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40' : 'border-slate-200 dark:border-slate-700'
    }`
  const fieldError = name => (fieldErrors[name]?.[0] ? <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors[name][0]}</p> : null)

  const categoryLabel = category => {
    const lang = i18n.resolvedLanguage || i18n.language
    return lang?.startsWith('ar') ? category.name_ar || category.name_en : category.name_en || category.name_ar
  }

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async () => {
    const localErrors = {}
    if (!form.name.trim()) localErrors.name = [t('medicines.modal.validation.nameRequired')]
    if (!form.category_id) localErrors.category_id = [t('medicines.modal.validation.categoryRequired')]
    if (form.price === '' || Number.isNaN(Number(form.price))) localErrors.price = [t('medicines.modal.validation.priceNumeric')]
    if (Number(form.price) < 0) localErrors.price = [t('medicines.modal.validation.priceNonNegative')]
    if (form.quantity_available === '' || !Number.isInteger(Number(form.quantity_available))) {
      localErrors.quantity_available = [t('medicines.modal.validation.stockWholeNumber')]
    }
    if (Number(form.quantity_available) < 0) localErrors.quantity_available = [t('medicines.modal.validation.stockNonNegative')]
    if (!form.expiration_date) localErrors.expiration_date = [t('medicines.modal.validation.expirationRequired')]

    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors)
      setError(t('medicines.modal.validation.correctFields'))
      return
    }

    setSaving(true)
    setError('')
    setFieldErrors({})

    try {
      await onSubmit(form)
      onClose()
    } catch (e) {
      const validation = extractValidation(e, t)
      setError(validation.summary)
      setFieldErrors(validation.fields)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <Modal title={title} onClose={onClose} className="min-w-5xl max-h-[92vh] p-0 overflow-hidden" bodyClassName="flex max-h-[calc(92vh-4rem)] flex-col">
      <div className="flex-1 overflow-y-auto bg-slate-50/70 dark:bg-slate-950/30 p-4">
        <div className="grid gap-3 xl:grid-cols-2">
          <FormSection title={t('medicines.modal.sections.basicInformation')}>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label={t('medicines.modal.form.medicineName')} error={fieldError('name')}>
                <input className={inputClass('name')} value={form.name} onChange={e => setField('name', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.genericName')} error={fieldError('scientific_name')}>
                <input className={inputClass('scientific_name')} value={form.scientific_name} onChange={e => setField('scientific_name', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.category')} error={fieldError('category_id')} className="md:col-span-2">
                <select className={inputClass('category_id')} value={form.category_id} onChange={e => setField('category_id', e.target.value)}>
                  <option value="">{t('medicines.modal.form.selectCategory')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {categoryLabel(category)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection title={t('medicines.modal.sections.inventoryPricing')}>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label={t('medicines.modal.form.stockQuantity')} error={fieldError('quantity_available')}>
                <input type="number" min="0" step="1" className={inputClass('quantity_available')} value={form.quantity_available} onChange={e => setField('quantity_available', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.price')} error={fieldError('price')}>
                <input type="number" min="0" step="0.01" className={inputClass('price')} value={form.price} onChange={e => setField('price', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.manufacturer')} error={fieldError('manufacturer')}>
                <input className={inputClass('manufacturer')} value={form.manufacturer} onChange={e => setField('manufacturer', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.dosage')} error={fieldError('dosage')}>
                <input className={inputClass('dosage')} value={form.dosage} onChange={e => setField('dosage', e.target.value)} placeholder={t('medicines.dosagePlaceholder')} />
              </Field>
            </div>
          </FormSection>

          <FormSection title={t('medicines.modal.sections.medicalValidity')}>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label={t('medicines.modal.form.expirationDate')} error={fieldError('expiration_date')}>
                <input type="date" className={inputClass('expiration_date')} value={form.expiration_date} onChange={e => setField('expiration_date', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.prescriptionRequired')} error={fieldError('requires_prescription')}>
                <select className={inputClass('requires_prescription')} value={form.requires_prescription ? '1' : '0'} onChange={e => setField('requires_prescription', e.target.value === '1')}>
                  <option value="0">{t('medicines.no')}</option>
                  <option value="1">{t('medicines.yes')}</option>
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection title={t('medicines.modal.sections.additionalDetails')} className="xl:col-span-2">
            <div className="grid gap-3">
              <Field label={t('medicines.modal.form.description')} error={fieldError('description')}>
                <textarea rows={3} className={textareaClass('description')} value={form.description} onChange={e => setField('description', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.usageInstructions')} error={fieldError('usage_instructions')}>
                <textarea rows={3} className={textareaClass('usage_instructions')} value={form.usage_instructions} onChange={e => setField('usage_instructions', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.image')} error={fieldError('image')}>
                <input type="file" accept="image/png,image/jpeg,image/webp" className={inputClass('image')} onChange={e => setField('image', e.target.files?.[0] || null)} />
              </Field>
            </div>
          </FormSection>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        {error ? <p className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            {t('medicines.modal.buttons.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? t('medicines.modal.buttons.saving') : t('medicines.modal.buttons.saveMedicine')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default MedicineFormModal
