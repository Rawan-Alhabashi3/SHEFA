import { useTranslation } from "react-i18next";
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MedicineFormModal from '../../components/pharmacy/MedicineFormModal';
import { addMedicine, deleteMedicine, getMyInventory, updateMedicine } from '../../services/pharmacyService';
import { FALLBACK_MEDICINE_IMAGE, resolveImageUrl, withFallback } from '../../utils/image';
const CATEGORY_KEY_ALIASES = {
  'pain relief': 'pain_relief',
  antibiotics: 'antibiotics',
  'vitamins supplements': 'vitamins_supplements',
  'vitamins supplement': 'vitamins_supplements',
  'vitamins & supplements': 'vitamins_supplements',
  diabetes: 'diabetes',
  'heart blood pressure': 'heart_blood_pressure',
  'heart & blood pressure': 'heart_blood_pressure',
  respiratory: 'respiratory',
  digestive: 'digestive',
  'skin care': 'skin_care',
  skincare: 'skin_care',
  'first aid': 'first_aid',
  medicine: 'medicine',
  cosmetic: 'cosmetic'
};
const normalizeCategoryKey = value => String(value || '').trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const normalizeCategoryAlias = value => String(value || '').trim().toLowerCase().replace(/\band\b/g, '&').replace(/[^a-z0-9&]+/g, ' ').replace(/\s+/g, ' ').trim();
const appendMedicineForm = (fd, form, {
  includeOptionalDate = true
} = {}) => {
  const fields = ['name', 'scientific_name', 'price', 'quantity_available', 'category', 'category_label', 'manufacturer', 'dosage', 'description', 'usage_instructions'];
  fields.forEach(field => {
    if (form[field] !== undefined && form[field] !== null && form[field] !== '') {
      fd.append(field, form[field]);
    }
  });
  if (includeOptionalDate || form.expiration_date) {
    fd.append('expiration_date', form.expiration_date);
  }
  fd.append('requires_prescription', form.requires_prescription ? '1' : '0');
  if (form.image) fd.append('image', form.image);
};
function PharmacyMedicinesPage() {
  const {
    t,
    i18n
  } = useTranslation("pharmacy");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const getCategoryLabel = (...values) => {
    const candidates = values.filter(Boolean);
    for (const value of candidates) {
      const aliasKey = CATEGORY_KEY_ALIASES[normalizeCategoryAlias(value)];
      const normalizedKey = aliasKey || normalizeCategoryKey(value);
      const categoryKey = `medicines.categories.${normalizedKey}`;
      const typeKey = `medicines.category.${normalizedKey}`;
      if (i18n.exists(categoryKey, {
        ns: 'pharmacy'
      })) return t(categoryKey);
      if (i18n.exists(typeKey, {
        ns: 'pharmacy'
      })) return t(typeKey);
    }
    return '';
  };
  const load = () => {
    setLoading(true);
    setError('');
    return getMyInventory({
      search,
      category
    }).then(res => setItems(res?.data || [])).catch(err => setError(err?.response?.data?.message || t('medicines.errors.failedToLoadInventory'))).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(m => q ? m.name.toLowerCase().includes(q) : true);
  }, [items, search]);
  const onCreate = async form => {
    const fd = new FormData();
    appendMedicineForm(fd, form);
    await addMedicine(fd);
    await load();
  };
  const onEdit = async form => {
    const fd = new FormData();
    fd.append('medicine_id', String(editing.id));
    appendMedicineForm(fd, form, {
      includeOptionalDate: false
    });
    await updateMedicine(fd);
    await load();
  };
  const onDelete = async medicineId => {
    await deleteMedicine({
      medicine_id: medicineId
    });
    await load();
  };
  
  return <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('medicines.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('medicines.description')}</p>
        </div>
        <Button onClick={() => {
        setEditing(null);
        setModalOpen(true);
      }}>
          <span className="inline-flex items-center gap-2"><Plus size={16} /> {t('medicines.addMedicine')}</span>
        </Button>
      </div>

      <Card className="p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <input className="rounded-xl border px-3 py-2 text-sm" placeholder={t('medicines.filters.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
          <select className="rounded-xl border px-3 py-2 text-sm" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">{t('medicines.filters.allCategories')}</option>
            <option value="medicine">{t('medicines.category.medicine')}</option>
            <option value="cosmetic">{t('medicines.category.cosmetic')}</option>
          </select>
          <Button variant="secondary" onClick={load}>{t('medicines.filters.applyFilters')}</Button>
        </div>

        {error ? <p className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead>
              <tr className="text-start text-slate-500 dark:text-slate-400">
                <th className="py-2">{t('medicines.table.medicine')}</th>
                <th className="py-2">{t('medicines.table.category')}</th>
                <th className="py-2">{t('medicines.table.price')}</th>
                <th className="py-2">{t('medicines.table.stock')}</th>
                <th className="py-2">{t('medicines.table.prescription')}</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td className="py-6 text-slate-500 dark:text-slate-400" colSpan={6}>{t('loading', {
            ns: 'common'
          })}</td></tr> : null}
              {!loading && filtered.length === 0 ? <tr><td className="py-6 text-slate-500 dark:text-slate-400" colSpan={6}>{t('medicines.emptyStates.noMedicinesFound')}</td></tr> : null}
              {!loading && filtered.map(m => <tr key={m.id} className="border-t">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={resolveImageUrl(m.image) || FALLBACK_MEDICINE_IMAGE} onError={withFallback(FALLBACK_MEDICINE_IMAGE)} alt={m.name} className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{m.name}</p>
                        {m.scientific_name ? <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{m.scientific_name}</p> : null}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{getCategoryLabel(m.category, m.category_label)}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">${Number(m.price).toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${m.quantity_available === 0 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-200' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-200'}`}>
                      {m.quantity_available}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{m.requires_prescription ? t('medicines.yes') : t('medicines.no')}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2 whitespace-nowrap">
                      <button className="rounded-xl border px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950" onClick={() => {
                    setEditing(m);
                    setModalOpen(true);
                  }}>
                        <span className="inline-flex items-center gap-2"><Pencil size={15} /> {t('medicines.buttons.edit')}</span>
                      </button>
                      <button className="rounded-xl border border-rose-200 dark:border-rose-700/70 px-3 py-2 text-rose-700 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:bg-rose-950/40" onClick={() => onDelete(m.id)}>
                        <span className="inline-flex items-center gap-2"><Trash2 size={15} /> {t('medicines.buttons.delete')}</span>
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      <MedicineFormModal open={modalOpen} mode={editing ? 'edit' : 'create'} initialValue={editing} onClose={() => setModalOpen(false)} onSubmit={editing ? onEdit : onCreate} />
    </section>;
}
export default PharmacyMedicinesPage;   