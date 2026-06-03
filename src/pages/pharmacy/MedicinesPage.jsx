import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import MedicineFormModal from '../../components/pharmacy/MedicineFormModal';
import { addMedicine, deleteMedicine, downloadMedicineImportTemplate, getMyInventory, updateMedicine } from '../../services/pharmacyService';
import { listCategories } from '../../services/categoryService';
import MedicinesPageHeader from '../../components/pharmacy/medicines/MedicinesPageHeader';
import MedicinesFiltersBar from '../../components/pharmacy/medicines/MedicinesFiltersBar';
import MedicinesTable from '../../components/pharmacy/medicines/MedicinesTable';
import MedicineBulkImportModal from '../../components/pharmacy/medicines/MedicineBulkImportModal';

const appendMedicineForm = (fd, form, { includeOptionalDate = true } = {}) => {
  const fields = ['name', 'scientific_name', 'price', 'quantity_available', 'category_id', 'manufacturer', 'dosage', 'description', 'usage_instructions'];
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
  const { t } = useTranslation('pharmacy');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);

  useEffect(() => {
    listCategories({ activeOnly: true })
      .then(items => setCategoryOptions(Array.isArray(items) ? items : []))
      .catch(() => setCategoryOptions([]));
  }, []);

  const load = () => {
    setLoading(true);
    setError('');
    return getMyInventory({
      search,
      category
    }).then(res => setItems(res?.data || [])).catch(err => setError(err?.response?.data?.message || t('medicinesPage.errors.failedToLoad'))).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(m => {
      const matchesSearch = q ? m.name.toLowerCase().includes(q) : true;
      const matchesCategory = category ? m.category?.slug === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

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

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (medicine) => {
    setEditing(medicine);
    setModalOpen(true);
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadMedicineImportTemplate();
    } catch (err) {
      console.error('Failed to download template:', err);
    }
  };

  const handleBulkImport = () => {
    setBulkImportOpen(true);
  };

  const handleBulkImportComplete = () => {
    setBulkImportOpen(false);
    load();
  };

  const isFiltered = search.trim() !== '' || category !== '';

  return (
    <section>
      <MedicinesPageHeader
        onAdd={handleAdd}
        onDownloadTemplate={handleDownloadTemplate}
        onBulkImport={handleBulkImport}
      />

      <Card className="p-5">
        <MedicinesFiltersBar
          search={search}
          category={category}
          categoryOptions={categoryOptions}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onApply={load}
        />

        {error ? <p className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

        <MedicinesTable
          medicines={filtered}
          loading={loading}
          isFiltered={isFiltered}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      </Card>

      <MedicineFormModal
        open={modalOpen}
        mode={editing ? 'edit' : 'create'}
        initialValue={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={editing ? onEdit : onCreate}
      />

      <MedicineBulkImportModal
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onComplete={handleBulkImportComplete}
      />
    </section>
  );
}

export default PharmacyMedicinesPage;   