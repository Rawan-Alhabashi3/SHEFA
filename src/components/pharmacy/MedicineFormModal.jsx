import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
const emptyForm = {
  name: '',
  scientific_name: '',
  price: '',
  category: 'medicine',
  category_label: '',
  manufacturer: '',
  dosage: '',
  quantity_available: '',
  expiration_date: '',
  requires_prescription: false,
  description: '',
  usage_instructions: '',
  image: null
};
const formatDateValue = value => {
  if (!value) return '';
  return String(value).slice(0, 10);
};
const extractValidation = (error, t) => {
  const data = error?.response?.data;
  const errors = data?.errors || (typeof data?.message === 'object' ? data.message : {});
  const first = Object.values(errors || {})?.[0]?.[0];
  return {
    summary: typeof data?.message === 'string' ? data.message : first || error?.message || t('medicines.modal.errors.unableToSave'),
    fields: errors || {}
  };
};
function FormSection({
  title,
  children,
  className = ''
}) {
  return <section className={`rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 ${className}`}>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h4>
      {children}
    </section>;
}
function Field({
  label,
  error,
  children,
  className = ''
}) {
  return <div className={className}>
      <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>
      {children}
      {error}
    </div>;
}
function MedicineFormModal({
  open,
  mode,
  initialValue,
  onClose,
  onSubmit
}) {
  const {
    t
  } = useTranslation("pharmacy");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  useEffect(() => {
    if (!open) return;
    if (initialValue) {
      setForm({
        name: initialValue.name || '',
        scientific_name: initialValue.scientific_name || '',
        price: String(initialValue.price ?? ''),
        category: initialValue.category || 'medicine',
        category_label: initialValue.category_label || '',
        manufacturer: initialValue.manufacturer || '',
        dosage: initialValue.dosage || '',
        quantity_available: String(initialValue.quantity_available ?? ''),
        expiration_date: formatDateValue(initialValue.expiration_date),
        requires_prescription: Boolean(initialValue.requires_prescription),
        description: initialValue.description || '',
        usage_instructions: initialValue.usage_instructions || '',
        image: null
      });
    } else {
      setForm(emptyForm);
    }
    setSaving(false);
    setError('');
    setFieldErrors({});
  }, [open, initialValue]);
  const title = useMemo(() => mode === 'edit' ? t('medicines.modal.editMedicine') : t('medicines.addMedicine'), [mode, t]);
  const inputClass = name => `h-10 w-full rounded-xl border bg-white dark:bg-slate-950 px-3 text-sm outline-none transition focus:border-blue-300 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 ${fieldErrors[name] ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40' : 'border-slate-200 dark:border-slate-700'}`;
  const textareaClass = name => `w-full rounded-xl border bg-white dark:bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-blue-300 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 ${fieldErrors[name] ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40' : 'border-slate-200 dark:border-slate-700'}`;
  const fieldError = name => fieldErrors[name]?.[0] ? <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors[name][0]}</p> : null;
  const setField = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = async () => {
    const localErrors = {};
    if (!form.name.trim()) localErrors.name = [t('medicines.modal.validation.nameRequired')];
    if (form.price === '' || Number.isNaN(Number(form.price))) localErrors.price = [t('medicines.modal.validation.priceNumeric')];
    if (Number(form.price) < 0) localErrors.price = [t('medicines.modal.validation.priceNonNegative')];
    if (form.quantity_available === '' || !Number.isInteger(Number(form.quantity_available))) localErrors.quantity_available = [t('medicines.modal.validation.stockWholeNumber')];
    if (Number(form.quantity_available) < 0) localErrors.quantity_available = [t('medicines.modal.validation.stockNonNegative')];
    if (!form.expiration_date) localErrors.expiration_date = [t('medicines.modal.validation.expirationRequired')];
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors);
      setError(t('medicines.modal.validation.correctFields'));
      return;
    }
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      await onSubmit(form);
      onClose();
    } catch (e) {
      const validation = extractValidation(e, t);
      setError(validation.summary);
      setFieldErrors(validation.fields);
    } finally {
      setSaving(false);
    }
  };
  if (!open) return null;
  return <Modal title={title} onClose={onClose} className="min-w-5xl max-h-[92vh] p-0 overflow-hidden" bodyClassName="flex max-h-[calc(92vh-4rem)] flex-col">
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
              <Field label={t('medicines.modal.form.category')} error={fieldError('category')}>
                <select className={inputClass('category')} value={form.category} onChange={e => setField('category', e.target.value)}>
                  <option value="medicine">{t('medicines.category.medicine')}</option>
                  <option value="cosmetic">{t('medicines.category.cosmetic')}</option>
                </select>
              </Field>
              <Field label={t('medicines.modal.form.categoryLabel')} error={fieldError('category_label')}>
                <input className={inputClass('category_label')} value={form.category_label} onChange={e => setField('category_label', e.target.value)} placeholder={t('medicines.categoryLabelPlaceholder')} />
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
              <div className="flex min-h-[4.25rem] items-end">
                <label className="flex h-10 w-full items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={form.requires_prescription} onChange={e => setField('requires_prescription', e.target.checked)} />
                  {t('medicines.modal.form.prescriptionRequired')}
                </label>
              </div>
              <div className="md:col-span-2">
                {fieldError('requires_prescription')}
              </div>
            </div>
          </FormSection>

          <FormSection title={t('medicines.modal.sections.media')}>
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-3">
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">{t('medicines.modal.form.image')}</label>
              <div className="flex flex-wrap items-center gap-3">
                <input id="medicine-image-upload" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={e => setField('image', e.target.files?.[0] || null)} />
                <label htmlFor="medicine-image-upload" className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  {t('medicines.modal.buttons.chooseImage')}
                </label>
                <span className="min-w-0 truncate text-sm text-slate-500 dark:text-slate-400">{form.image?.name || t('medicines.modal.form.noImageSelected')}</span>
              </div>
              {fieldError('image')}
            </div>
          </FormSection>

          <FormSection title={t('medicines.modal.sections.details')} className="xl:col-span-2">
            <div className="grid gap-3 lg:grid-cols-2">
              <Field label={t('medicines.modal.form.description')} error={fieldError('description')}>
                <textarea className={textareaClass('description')} rows={3} value={form.description} onChange={e => setField('description', e.target.value)} />
              </Field>
              <Field label={t('medicines.modal.form.usageInstructions')} error={fieldError('usage_instructions')}>
                <textarea className={textareaClass('usage_instructions')} rows={3} value={form.usage_instructions} onChange={e => setField('usage_instructions', e.target.value)} />
              </Field>
            </div>
          </FormSection>
        </div>
      </div>
      {error ? <p className="mx-4 mt-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}
      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <Button variant="secondary" onClick={onClose}>{t('medicines.modal.buttons.cancel')}</Button>
        <Button onClick={handleSubmit} disabled={saving}>{saving ? t('medicines.modal.buttons.saving') : t('medicines.modal.buttons.save')}</Button>
      </div>
    </Modal>;
}
export default MedicineFormModal;