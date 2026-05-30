import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';
import { formatPrice } from '../../utils/format';

function AdminMedicinesPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('medicines.title')} description={t('medicines.description')} resource="medicines" columns={[
    {
      key: 'id',
      label: t('medicines.columns.id')
    },
    {
      key: 'name',
      label: t('medicines.columns.medicine')
    },
    {
      key: 'category',
      label: t('medicines.columns.category')
    },
    {
      key: 'price',
      label: t('medicines.columns.price'),
      render: row => formatPrice(row.price || 0)
    },
    {
      key: 'quantity_available',
      label: t('medicines.columns.stock')
    },
    {
      key: 'is_active',
      label: t('medicines.columns.status'),
      render: row => row.is_active ? t('medicines.statuses.active') : t('medicines.statuses.suspended'),
      badge: true
    }
  ]} editableFields={[
    {
      name: 'is_active',
      label: t('medicines.actions.toggleActive'),
      nextValue: row => !row.is_active
    }
  ]} />;
}
export default AdminMedicinesPage;