import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage'

function AdminExchangeRequestsPage() {
  const { t } = useTranslation("admin");
  return (
    <AdminModulePage
      title={t('exchangeRequests.title')}
      description={t('exchangeRequests.description')}
      resource="exchange-requests"
      columns={[
        { key: 'id', label: t('exchangeRequests.columns.requestId') },
        { key: 'status', label: t('exchangeRequests.columns.status'), badge: true },
        { key: 'pharmacy_notes', label: t('exchangeRequests.columns.pharmacyNotes') },
        { key: 'created_at', label: t('exchangeRequests.columns.created'), render: (row) => new Date(row.created_at).toLocaleDateString() },
      ]}
      editableFields={[
        { name: 'status', label: t('exchangeRequests.actions.setPending'), nextValue: () => 'pending' },
        { name: 'status', label: t('exchangeRequests.actions.setRejected'), nextValue: () => 'rejected' },
      ]}
    />
  )
}

export default AdminExchangeRequestsPage
