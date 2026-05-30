import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage'

function AdminDeliveryMissionsPage() {
  const { t } = useTranslation("admin");
  return (
    <AdminModulePage
      title={t('deliveryMissions.title')}
      description={t('deliveryMissions.description')}
      resource="delivery-missions"
      columns={[
        { key: 'id', label: t('deliveryMissions.columns.missionId') },
        { key: 'customer_name', label: t('deliveryMissions.columns.customer') },
        { key: 'governorate', label: t('deliveryMissions.columns.governorate') },
        { key: 'area', label: t('deliveryMissions.columns.area') },
        { key: 'status', label: t('deliveryMissions.columns.status'), badge: true },
        { key: 'created_at', label: t('deliveryMissions.columns.created'), render: (row) => new Date(row.created_at).toLocaleDateString() },
      ]}
      editableFields={[
        { name: 'status', label: t('deliveryMissions.actions.markPending'), nextValue: () => 'pending' },
        { name: 'status', label: t('deliveryMissions.actions.markCancelled'), nextValue: () => 'cancelled' },
      ]}
    />
  )
}

export default AdminDeliveryMissionsPage
