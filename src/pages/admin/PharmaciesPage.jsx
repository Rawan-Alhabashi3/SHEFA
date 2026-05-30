import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';

function AdminPharmaciesPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('pharmacies.title')} description={t('pharmacies.description')} resource="pharmacies" columns={[
    {
      key: 'id',
      label: t('pharmacies.columns.id')
    },
    {
      key: 'pharmacy_name',
      label: t('pharmacies.columns.pharmacy')
    },
    {
      key: 'governorate',
      label: t('pharmacies.columns.city')
    },
    {
      key: 'status',
      label: t('pharmacies.columns.status'),
      badge: true
    },
    {
      key: 'phone',
      label: t('pharmacies.columns.phone')
    },
    {
      key: 'user',
      label: t('pharmacies.columns.owner'),
      render: row => row.user?.username || '-'
    }
  ]} editableFields={[
    {
      name: 'status',
      label: t('pharmacies.actions.approve'),
      nextValue: () => 'approved'
    },
    {
      name: 'status',
      label: t('pharmacies.actions.reject'),
      nextValue: () => 'rejected'
    }
  ]} />;
}
export default AdminPharmaciesPage;