import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage'

function AdminDriversPage() {
  const { t } = useTranslation("admin");
  return (
    <AdminModulePage
      title={t('drivers.title')}
      description={t('drivers.description')}
      resource="deliveries"
      columns={[
        { key: 'id', label: t('drivers.columns.id') },
        { key: 'user', label: t('drivers.columns.driver'), render: (row) => row.user?.username || '-' },
        { key: 'governorate', label: t('drivers.columns.city') },
        { key: 'vehicle_type', label: t('drivers.columns.vehicle') },
        { key: 'availability_status', label: t('drivers.columns.availability'), render: (row) => (row.availability_status ? t('drivers.statuses.active') : t('drivers.statuses.suspended')), badge: true },
      ]}
      editableFields={[
        { name: 'availability_status', label: t('drivers.actions.toggleAvailability'), nextValue: (row) => !row.availability_status },
      ]}
    />
  )
}

export default AdminDriversPage
