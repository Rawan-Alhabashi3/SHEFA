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
const extractValidation = error => {
  const data = error?.response?.data;
  const errors = data?.errors || (typeof data?.message === 'object' ? data.message : {});
  const first = Object.values(errors || {})?.[0]?.[0];
  return {
    summary: typeof data?.message === 'string' ? data.message : first || error?.message || 'Unable to save medicine.',
    fields: errors || {}
  };
};
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
  const inputClass = name => `w-full rounded-xl border px-3 py-2 ${fieldErrors[name] ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40' : 'border-slate-200 dark:border-slate-700'}`;
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
    if (!form.name.trim()) localErrors.name = [t('medicines.modal.validation.nameRequired') || 'Medicine name is required.'];
    if (form.price === '' || Number.isNaN(Number(form.price))) localErrors.price = [t('medicines.modal.validation.priceNumeric') || 'Price must be numeric.'];
    if (Number(form.price) < 0) localErrors.price = [t('medicines.modal.validation.priceNonNegative') || 'Price must be zero or greater.'];
    if (form.quantity_available === '' || !Number.isInteger(Number(form.quantity_available))) localErrors.quantity_available = [t('medicines.modal.validation.stockWholeNumber') || 'Stock quantity must be a whole number.'];
    if (Number(form.quantity_available) < 0) localErrors.quantity_available = [t('medicines.modal.validation.stockNonNegative') || 'Stock quantity must be zero or greater.'];
    if (!form.expiration_date) localErrors.expiration_date = [t('medicines.modal.validation.expirationRequired') || 'Expiration date is required.'];
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors);
      setError(t('medicines.modal.validation.correctFields') || 'Please correct the highlighted fields.');
      return;
    }
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      await onSubmit(form);
      onClose();
    } catch (e) {
      const validation = extractValidation(e);
      setError(validation.summary);
      setFieldErrors(validation.fields);
    } finally {
      setSaving(false);
    }
  };
  if (!open) return null;
  return <Modal title={title} onClose={onClose}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('medicines.modal.form.medicineName')}</label>
          <input className={inputClass('name')} value={form.name} onChange={e => setField('name', e.target.value)} />
          {fieldError('name')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('medicines.modal.form.genericName')}</label>
          <input className={inputClass('scientific_name')} value={form.scientific_name} onChange={e => setField('scientific_name', e.target.value)} />
          {fieldError('scientific_name')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('medicines.modal.form.category')}</label>
          <select className={inputClass('category')} value={form.category} onChange={e => setField('category', e.target.value)}>
            <option value="medicine">{t("Medicine")}</option>
            <option value="cosmetic">Cosmetic</option>
          </select>
          {fieldError('category')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('medicines.modal.form.categoryLabel')}</label>
          <input className={inputClass('category_label')} value={form.category_label} onChange={e => setField('category_label', e.target.value)} placeholder={t("Pain Relief")} />
          {fieldError('category_label')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('medicines.modal.form.price')}</label>
          <input type="number" min="0" step="0.01" className={inputClass('price')} value={form.price} onChange={e => setField('price', e.target.value)} />
          {fieldError('price')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t("Stock quantity")}</label>
          <input type="number" min="0" step="1" className={inputClass('quantity_available')} value={form.quantity_available} onChange={e => setField('quantity_available', e.target.value)} />
          {fieldError('quantity_available')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('medicines.modal.form.expirationDate')}</label>
          <input type="date" className={inputClass('expiration_date')} value={form.expiration_date} onChange={e => setField('expiration_date', e.target.value)} />
          {fieldError('expiration_date')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t("Manufacturer")}</label>
          <input className={inputClass('manufacturer')} value={form.manufacturer} onChange={e => setField('manufacturer', e.target.value)} />
          {fieldError('manufacturer')}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t("Dosage")}</label>
          <input className={inputClass('dosage')} value={form.dosage} onChange={e => setField('dosage', e.target.value)} placeholder={t("500mg")} />
          {fieldError('dosage')}
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('medicines.modal.form.description')}</label>
          <textarea className={inputClass('description')} rows={3} value={form.description} onChange={e => setField('description', e.target.value)} />
          {fieldError('description')}
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t("Usage instructions")}</label>
          <textarea className={inputClass('usage_instructions')} rows={2} value={form.usage_instructions} onChange={e => setField('usage_instructions', e.target.value)} />
          {fieldError('usage_instructions')}
        </div>
        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.requires_prescription} onChange={e => setField('requires_prescription', e.target.checked)} />
            {t('medicines.modal.form.prescriptionRequired')}
          </label>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setField('image', e.target.files?.[0] || null)} />
        </div>
        {fieldError('requires_prescription')}
        {fieldError('image')}
      </div>
      {error ? <p className="mt-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>{t('medicines.modal.buttons.cancel')}</Button>
        <Button onClick={handleSubmit} disabled={saving}>{saving ? t('medicines.modal.buttons.saving') : t('medicines.modal.buttons.save')}</Button>
      </div>
    </Modal>;
}
export default MedicineFormModal;